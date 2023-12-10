const DBUserManager = require("../dao/DBUserManager")
const userDao = new DBUserManager()
const DBCartManager = require("../dao/DBCartManager")
const cartDao = new DBCartManager()
const DBProductManager = require("../dao/DBProductManager")
const productDao = new DBProductManager()
const products = require("../managerDB.json")
const { generateToken, verifyToken } = require("../utils/jwt")
const BaseRouter = require("./BaseRouter")
const { faker } = require("@faker-js/faker")
const nodemailer = require("nodemailer")

const sessionMidleware = (req, res, next) => {
    if (req.session.usuario) {
        return res.redirect("/profile")
    }

    return next()
}

const authMidleware = async (req, res, next) => {
    const token = req.user.access_token//.replace("Bearer ", "")

    if (!token) {
        return res.status(401).json({ error: "Token invalido" })
    }
    const payload = await verifyToken(token)
    req.user = payload.user

    return next()
}

const authProducts = async (req, res, next) => {
    const user = req.user
    if (user === undefined) {
        return res.redirect("/login")
    }
    return next()
}

class ViewsRouter extends BaseRouter {
    init() {
        this.get("/prod", (req, res) => {

            const params = {
                titulo: "Productos",
                products
            }
            return res.render("home", params)
        })

        this.get("/realtimeproducts", (req, res) => {
            return res.render("realTimeProducts")
        })

        this.get("/register", sessionMidleware, async (req, res) => {
            const error = req.flash("error")[0]
            return res.render("register", {
                error,
                hasError: error !== undefined
            })
        })

        this.get("/login", sessionMidleware, (req, res) => {
            const error = req.flash("error")[0]
            return res.render("login", {
                error,
                hasError: error !== undefined
            })
        })

        this.get("/recovery", sessionMidleware, (req, res) => {
            return res.render("recovery")
        })

        //Vista de admin
        this.get("/products", authProducts,//authMidleware , 
            async (req, res) => {
                const user = req.user

                const first_name = req.user.first_name
                const last_name = req.user.last_name
                const email = req.user.email
                const age = req.user.age
                const rol = "Admin"
                const provider = "Local"
                return res.render("products", { user, first_name, last_name, email, age, rol, provider })
            })

        this.get("/profile", //authMidleware,
            (req, res) => {
                const user = req.user
                const token = generateToken(user)
                user.access_token = token

                const first_name = req.user.first_name
                const last_name = req.user.last_name
                const email = req.user.email
                const age = req.user.age
                const rol = "User"
                const provider = "Local"

                //return res.json(user)
                return res.render("profile", { user, first_name, last_name, email, age, rol, provider })
            })

        this.get("/recoverysuccess", (req, res) => {
            return res.render("recoverysuccess")
        })

        this.get("/logout", (req, res) => {
            return res.redirect("login")
        })

        this.get("/faillogin", (req, res) => {
            return res.json({ error: "failLogin" })
        })

        this.get("/current", (req, res) => {
            return res.redirect("/api/sessions/current")
        })

        this.get("/actualizar", async (req, res) => {
            const pid = req.query.pid
            const product = await productDao.getProductById(pid)
            const name = product.tittle
            return res.render("actualizar", { pid, name })
        })

        this.get("/cart", async (req, res) => {
            /*const uid = req.session.passport.user
            const user = await userDao.getUserById(uid)
            const cart = await cartDao.getCartById(user.cart)
            const cartName = cart.name
            const cartProducts = cart.products*/

            return res.render("cart")
        })

        this.get("/addProduct", (req, res) => {
            return res.render("addProduct")
        })

        this.get("/recovering", (req, res) => {
            return res.render("recovering")
        })

        this.get("/sendEmail", (req, res) => {
            return res.render("sendEmail")
        })

        this.get("/", (req, res) => {
            return res.redirect("/login")
        })

        this.get("/usersDetail", async (req, res) => {
            const users = await userDao.getUsers()
            if (users.length === 0) {
                return res.render("emptyUsers")
            }
            const usersToView = []
            users.forEach(item => {
                const user = {
                    _id: item._id,
                    name: item.first_name,
                    lastName: item.last_name,
                    email: item.email,
                    age: item.age,
                    rol: item.typeCount
                }
                usersToView.push(user)
            })

            return res.render("usersDetail", { usersToView })
        })

        this.get("/updateUser", async (req, res) => {
            const uid = req.query.uid
            const user = await userDao.getUserById(uid)
            const name = user.first_name
            return res.render("updateUser", { name, uid })
        })

        this.get("/endBuy", async (req, res) => {
            const uid = req.session.passport.user
            const user = await userDao.getUserById(uid)
            const email = user.email
            
            //ID fake:
            const idRandom = faker.string.alphanumeric(25)

            //Mail:
            const transport = nodemailer.createTransport({
                //host: 'smtp.ethereal.email', // (para ethereal-pruebas)
                host: process.env.PORT, //(para Gmail)
                service: "gmail", //(para Gmail)
                port: 587,
                auth: {
                    user: process.env.USER,
                    pass: process.env.PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            })
            const correo = await transport.sendMail({
                from: process.env.USER,//Correo del emisor
                to: `${email}`,//Correo del receptor
                subject: "My aplication",//Asunto del correo
                html: `<div>
          <h1>Success buy</h1>
          <h3>¡Hola, ${user.first_name}!</h3>
          <p>Tu compra se ha realizado con exito, tu ID de compra es  <strong>${idRandom}</strong></p>
          <p>¡Gracias por confiar en nosotros!</p>
          <h6>ATT: TEAM My Aplication</h6>
          </div>`,//Cuerpo del mensaje
                /*attachments: [{
                  filename: "",//Nombre del archivo(eje: pera.jpg)
                  path:"",//ruta de la imagen(eje:./imgs/Pera.jpg)
                  cid: ""//Nombre de la imagen(eje: Pera)
                }]*/
            })

            return res.render("endBuy", { idRandom })
        })
    }
}

module.exports = ViewsRouter