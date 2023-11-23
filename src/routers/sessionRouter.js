const express = require("express")
const passport = require("passport")
const userModel = require("../dao/models/userModel")
const notifier = require('node-notifier')
const productsmodels = require("../dao/models/productsModels")
const { createHash, isValidPassword } = require("../utils/passwordHash")
const { generateToken } = require("../utils/jwt")
const DBProductManager = require("../dao/DBProductManager")
const dbproductManager = new DBProductManager() //Para usar mongo
const DBCartManager = require("../dao/DBCartManager")
const dbcartManager = new DBCartManager()
const bcrypt = require("bcrypt")
const nodemailer = require("nodemailer")
const DBUserManager = require("../dao/DBUserManager")
const userDao = new DBUserManager()
const cartsModels = require("../dao/models/cartsModels")

const BaseRouter = require("./BaseRouter")

const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString()
        })
      }

      req.user = user
      console.log(req.user)

      return next()
    })(req, res, next)
  }
}

class SessionRouter extends BaseRouter {
  init() {
    this.get("/github", passport.authenticate("github", { scope: ["user:email"] }), async (req, res) => {
    })

    this.get("/github-callback", passport.authenticate("github", { failureRedirect: "/login" }), async (req, res) => {
      const user = req.user

      const username = req.user.first_name
      const lastname = req.user.last_name
      const email = req.user.email
      const age = req.user.age
      const rol = req.user.typeCount
      const provider = req.user.provider

      //Si no existe carrito al iniciar sesion creo uno:
      const name = user.first_name
      if (!user.cart) {
        const newCart = await cartsModels.create({
          name: `Carrito de ${name}`,
          products: []
        })

        await userModel.updateOne({ _id: user._id }, { cart: newCart._id })
      }

      //Pagino los productos
      const prodts = await dbproductManager.getProducts()
      const limit = prodts.length //req.query.limit || 10
      const page = 1 //req.query.page
      const prods = await dbproductManager.getProducts()

      const products = await productsmodels.paginate({}, { limit, page })

      products.docs = prods

      products.docs = products.docs.map(user => user.toObject())

      products.docs.forEach(function (item) {
        item.cartId = user.cart
      })

      const cartId = user.cart

      req.logger.info("✔ ¡Sesion iniciada!")
      return res.render("profileGitHub", { username, lastname, email, age, rol, provider, products, cartId })
    })

    this.get("/", (req, res) => {
      return res.redirect("/api/sessions/login")


      if (!req.session.counter) {
        req.session.counter = 1
        req.session.username = req.query.username

        return res.json(`Hola ${req.session.username}`)
      } else {
        req.session.counter++

        return res.json(`${req.session.username} has ingreado ${req.session.counter} veces`)
      }
    })

    this.post("/register",
      passport.authenticate("register", { failureRedirect: "/register", failureFlash: true }),
      async (req, res) => {
        //Hasheo la contraseña
        /*const body = req.body
        body.password = createHash(body.password)
    
        const user = await userModel.create(body)
        const usuarioCreado = user
        console.log({usuarioCreado})*/


        //JWT:
        const nuevoUsuario = req.body

        const token = generateToken({
          username: nuevoUsuario.first_name,
          email: nuevoUsuario.email
        })

        nuevoUsuario.access_token = token

        req.logger.info("¡Se registro un nuevo usuario!")

        //return res.status(201).json({ ...nuevoUsuario, access_token: token})
        return res.redirect("/login") //Respuesta de redireccion
        //return res.status(201).json(req.user) //Respuesta de api(JSON)
      })

    this.post("/login",
      passport.authenticate("login", { failureRedirect: "/login", failureFlash: true }), (req, res, next) => {
        if (!req.user) {
          return res.redirect("/login")
        }

        return next()
      }, async (req, res) => {
        const user = req.user
        const limit = 50 //req.query.limit || 10
        const page = req.query.page || 1

        user.provider = "Local"

        //Si no existe carrito al iniciar sesion creo uno:
        const nombre = user.first_name
        if(!user.cart){
            const newCart = await cartsModels.create({
                name: `Carrito de ${nombre}`,
                products: []
            })

            await userModel.updateOne({_id: user._id}, {cart: newCart._id})
        }

        //Pagino los productos
        const prods = await dbproductManager.getProducts()

        const products = await productsmodels.paginate({}, { limit, page })

        products.docs = prods

        products.docs = products.docs.map(user => user.toObject())

        products.docs.forEach(function (item) {
          item.cartId = user.cart
        })

        //Valido el tipo de cuenta y modifico el rol (el admin se evalua por el correo)
        if (user.email === "adminCoder@coder.com") {
          user.rol = "Admin"
        }
        if (user.typeCount === "Premium") {
          user.rol = "Premium"
        }
        if (user.typeCount === "User") {
          user.rol = "User"
        }

        //Genero token:
        const token = generateToken({
          first_name: req.user.first_name,
          email: req.user.email,
          rol: req.user.rol,
          cart: req.user.cart
        })
        user.access_token = token

        const cartId = user.cart._id //_id undefinded??

        //Valido si el usuario es admin:(Respuestas de Admin)
        if (user.rol === "Admin") {
          req.logger.info("✔ ¡Sesion iniciada!")
          return res.cookie(`Token`, token, { maxAge: 60 * 60 * 1000 }).render("adminProfile", { products, user })//Renderizado a perfil de Admin
          //return res.status(200).json(req.user)//Respuesta de JSON
          //return res.cookie(`Token`, token, {maxAge: 60 * 60 * 1000}).redirect("/api/sessions/current")//Redireccion a current
          //return res.redirect("/products")//Redireccion a perfil de admin
        }

        //Respuesta usuario Premium
        if (user.rol === "Premium") {
          req.logger.info("✔ ¡Sesion iniciada!")
          return res.cookie(`Token`, token, { maxAge: 60 * 60 * 1000 }).render("premiumProfile", { products, user, cartId })
        }

        //(Respuestas de User):
        if (user.rol === "User") {
          //return res.cookie(`Token`, token, {maxAge: 60 * 60 * 1000}).redirect("/api/sessions/current")//Redireccion a current
          req.logger.info("✔ ¡Sesion iniciada!")
          return res.cookie(`Token`, token, { maxAge: 60 * 60 * 1000 }).render("userProfile", { products, user, cartId })//Renderizado a perfil de User
          //return res.redirect("/profile")//Redireccion a perfil de User
          //return res.status(200).json(req.user)//Respuesta de JSON
        }
      })

    this.post("/logout", (req, res) => {
      req.session.destroy(e => {
        if (!e) {
          req.logger.info("⛔ ¡Sesion cerrada!")
          return res.redirect("/login")
        }
        return res.render("login")
      })
    })

    this.post("/recovery", async (req, res) => {
      let verificar = await userModel.findOne({ email: req.body.email })
      const email = req.body.email

      //Especifico la hora actual en la que se va a restablecer la contraseña 
      const dateNow = new Date().toLocaleString()

      const expirated = verificar.expiratedLink

      //Valido si el link ya expiro, en caso tal redirijo para generarlo nuevamente y notifico:
      const comparar = dateNow > expirated

      if (comparar === true) {
        req.logger.warning("Ha expirado el link de recuperacion, por favor genera uno nuevamente")
        notifier.notify({
          title: '¡Link expirated!',
          message: 'Ha expirado el link de recuperacion, por favor genera uno nuevamente',
          icon: "",
          sound: true,
          wait: true
        })
        return res.redirect("/recovering")
      }

      if (!verificar) {
        return res.status(404).json({
          error: "No existe el usuario"
        })
      }

      const password = verificar.password
      const newP = req.body.password

      //Comparo y valido si la contraseña de la base de datos es igual a la que me llega por el body:
      bcrypt.compare(newP, password, async (error, result) => {
        if (error) throw error
        if (result) {
          return res.status(500).json({ message: "No puedes actualizar con la contraseña que tienes actualmente" }).req.logger.warning("No puedes actualizar con la contraseña que tienes actualmente")
        }

        const nuevaPassword = createHash(req.body.password)

        await userModel.updateOne({ _id: verificar._id }, { password: nuevaPassword })

        req.logger.info("¡Se restableció correctamente la contraseña! ✔")

        //Mailling:
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
          <h1>Recovery successful ✅</h1>
          <h3>¡Hola, ${verificar.first_name}!</h3>
          <p>Se ha restablecido correctamente la contraseña de tu cuenta, si no has sido tú ponte en contacto con soporte, gracias por confiar en nosotros.</p>
          </div>`,//Cuerpo del mensaje
          /*attachments: [{
            filename: "",//Nombre del archivo(eje: pera.jpg)
            path:"",//ruta de la imagen(eje:./imgs/Pera.jpg)
            cid: ""//Nombre de la imagen(eje: Pera)
          }]*/
        })

        return res.redirect("/recoverysuccess")
      })

    })

    this.post("/recovering", async (req, res) => {
      const email = req.body.email

      //Valido si el correo que me llego esta en la base de datos
      const users = await userDao.getUsers()
      const user = users.find(item => item.email === email)

      if (!user) {
        return res.status(400).json({ error: "El correo ingresado no se encuentra registrado" }).req.logger.error("El correo ingresado no se encuentra registrado")
      }

      const verificar = new Date().toLocaleString()

      user.date = verificar

      //Actualizo para que el link expire en 1 hora
      const now = new Date().getTime()
      const add = 60 * 60000
      const addedHour = new Date(now + add).toLocaleString()

      user.expiratedLink = addedHour

      const body = user
      const id = user._id

      const update = await userDao.updateUser(id, body)

      //Mailling:
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
          <h1>Recovery password</h1>
          <h3>¡Hola, ${user.first_name}!</h3>
          <p>Da click <a href="http://localhost:${process.env.PORT}/recovery">AQUI</a> para restablecer contraseña</p>
          </div>`,//Cuerpo del mensaje
        /*attachments: [{
          filename: "",//Nombre del archivo(eje: pera.jpg)
          path:"",//ruta de la imagen(eje:./imgs/Pera.jpg)
          cid: ""//Nombre de la imagen(eje: Pera)
        }]*/
      })
      return res.redirect("/sendEmail")
    })

    this.get("/failregister", (req, res) => {
      return res.json({
        error: "Error al registrarse"
      })
    })

    this.get("/faillogin", (req, res) => {
      return res.json({
        error: "Error al iniciar sesion"
      })
    })

    this.get("/current", passportCall("jwt"), (req, res) => {
      const user = req.user

      //Usuario solo con los datos que quiero mostrar
      const userToSend = {
        name: user.first_name,
        email: user.email,
        rol: user.rol
      }

      return res.send(userToSend)
    })
  }
}

module.exports = SessionRouter