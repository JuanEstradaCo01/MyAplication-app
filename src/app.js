const express = require("express")
const ProductRouter = require("./routers/productRouter")
const productRouter = new ProductRouter()
const CartRouter = require("./routers/cartRouter")
const cartRouter = new CartRouter()
const ViewsRouter = require("./routers/viewsRouter")
const viewsRouter = new ViewsRouter()
const handlebars = require("express-handlebars")
const productsmodels = require("./dao/models/productsModels")
const viewsRouterFn = require("./routers/chatViewsRouter") //chat
const ProductManager = require("./dao/FS/FSProductManager")
const managerDB = new ProductManager("./managerDB.json")
const DBMessagesManager = require("./dao/DBMessagesManager")
const dbmessagesmanager = new DBMessagesManager()
const DbProductManager = require("./dao/DBProductManager")
const dbproductManager = new DbProductManager()
const DBCartManager = require("./dao/DBCartManager")
const dbcartManager = new DBCartManager()
const cookieParser = require("cookie-parser")
const session = require("express-session")
const FileStore = require("session-file-store")
const MongoStore = require("connect-mongo")
const SessionRouter = require("./routers/sessionRouter")
const sessionRouter = new SessionRouter()
const passport = require("passport")
const initializePassport = require ("./config/passport.config")
const flash = require("connect-flash")
const cors = require("cors")
const dotenv = require("dotenv")
const configFn = require("./config")
const DB = require("./config/singleton")
const {Command} = require("commander")
const nodemailer = require("nodemailer")
const mongoose = require("mongoose")

//DOTENV: 
const program = new Command()

//Por default sera "local"
program 
  .option('--mode <mode>', 'Modo de trabajo', 'local')

program.parse()

const options = program.opts()
dotenv.config({
  path: `./.env.${options.mode}`
})

const mode = options.mode
console.log({mode})

const config = configFn()

//Conexion a la base de datos(MongoDB):
const dbConnection = DB.getConnection(config)

//IIFE
;(async () => {

    //Productos a agregar:
    const productos = await managerDB.getProducts()


    //Agregando los productos a mongo:(se comenta para que no agregue varias veces)
    //await productsmodels.insertMany(productos)



      //Vista de los productos paginados
      app.get("/products", async ( req, res) => {

        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const query = req.query.query
      

        //Traigo los productos que tengan la categoria especificada en query por params y los ordeno de manera ascendente(⬆) por su precio:
        const prod = await productsmodels.aggregate([
          {
            $match: { category: query }
          },{
            $sort: { price: 1 }
          }
        ])
        console.log(prod)


        //Pagino los productos en la vista "/products"
        const products = await productsmodels.paginate({  }, {limit, page})

        products.docs = products.docs.map(user => user.toObject())
    
        return res.render("products", products)
      })


      //Populate:(se comenta ya que no hay carritos hechos, si existe un carrito descomentar para desglosar los productos dentro del carrito)

      /*const cart = await cartsModels.findOne().populate(`products.product`)

      const product =  await productsModels.findOne()


      cart.products.push({product: product._id})

      await cartsModels.updateOne({_id: cart._id}, cart)

      console.log({cart: JSON.stringify(cart, null, 2)})*/
})()


const socketServer = require("./utils/io")
const DBProductManager = require("./dao/DBProductManager")
const cartsModels = require("./dao/models/cartsModels")
const productsModels = require("./dao/models/productsModels")

const app = express()

app.use(cookieParser("secretCookie"))

//NOTA: Para agregar productos ir a (/realtimeProducts) que nos muestra el formulario y la lista de productos la cual funciona en tiempo real al agregar un producto

//CORS
app.use(cors())


//Configuracion basica
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))


//Flash:
app.use(flash())



//app.use("/static", express.static("public"))


//configurando handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", "./views")
app.set("view engine", "handlebars")



const PUERTO = process.env.PUERTO || 8080

const httpServer = app.listen(PUERTO, () => {
    console.log(`Servidor express escuchando en el puerto ${PUERTO}`)
})

const io = socketServer(httpServer)


//chat
const users = []
const mensajesArray = []


io.on("connection", socket => {
    console.log("Nuevo cliente conectado", socket.id)

    socket.on("unirseChat", username => {
        users.push({
            nombre: username,
            socketId: socket.id
        })
        socket.broadcast.emit('notificacion', `${username} se ha unido al chat`)
        socket.emit('notificacion', `¡Te has unido al chat como ${username}!`)

        
        //Para que un usuario nuevo vea todo el historial de mensajes (descomentar en el emit y en la parte del frontend en index.js)
        //socket.emit('mensajes', JSON.parse(mensajesArray))
    })

    socket.on('nuevoMensaje', mensaje => {
        const usuario = users.find(u => u.socketId === socket.id)
        const nuevoMensaje = {
            usuario: usuario.nombre,
            mensaje
        }
        console.log({Message: nuevoMensaje})

        const message = JSON.stringify(nuevoMensaje)
        
        mensajesArray.push(nuevoMensaje)

        io.emit('mensaje', message)
    })
})




//Cookies:
app.use(cookieParser("secretKey"))

app.get("/setCookie", (req, res) => {
  return res.cookie("CoderCookie", "Valor de la cookie", {maxAge: 50000}).send("Cookie")
})

app.get("/getCookie", (req, res) => {
  return res.send({
    cookies: req.cookies,
    signedCookies: req.signedCookies //Cookies firmadas
  })
})

app.get("/deleteCookie", (req, res) => {
  return res.clearCookie("CoderCookie").send("Cookie eliminada")
})

app.get("/signedCookie", (req, res) => {
  return res.cookie("SignedCoderCookie", "Esta es una cookie firmada y especial", {signed: true}).send("Cookie")
})


app.get("/cookiesForm", (req, res) => {
  return res.render("cookies")
})

app.post("/cookiesForm", (req, res) => {
  return res.cookie("User", req.body, {maxAge: 10000}).redirect("/cookiesForm")
})





const fileStorage = FileStore(session)


app.use(session({
  //Configuracion de fileStorage
  //store: new fileStorage({
    //path:"./sessions",
    //ttl: 100,
    //retries: 0
  //})

  /*store: MongoStore.create({
    mongoUrl: MONGODB_CONNECT_LOCAL,
    //ttl: 10
  }),*/
  secret: "secretSession",
  resave: true,
  saveUninitialized: true
}))



//Passport:
initializePassport()
app.use(passport.initialize())
app.use(passport.session())


/*
app.get("/login", (req, res) => {
  const { username, password } = req.query

  const user = usuarios.find( ele => ele.username === username && ele.password === password)

  if (!user) {
    return res.status(404).json({
      error: "User not found"
    })
  }

  req.session.username = user.username
  req.session.admin = user.admin

  return res.json(user)
})
*/

const authMidleware = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).send("Necesitas iniciar sesion para continuar")
  }

  return next()
}

app.get("/auth", authMidleware, (req, res) => {
  return res.send(`Autenticacion correcta. Bienvenido ${req.session.username}`)
})

const adminMidleware = (req, res, next) => {
  if (!req.session.admin)
    return res.status(401).send("Acceso negado, no eres administrador")

  return next()
}

app.get("/admin", authMidleware, adminMidleware,(req, res) => {
  return res.send(`Cuenta de administrador. Hola ${req.session.username}`)
})





//Vista de detalles
app.get("/detalles", async (req, res) => {
  const pid = req.query.pid
  const productos = await dbproductManager.getProducts()
  const detalles = productos.find(el => el._id == pid)
  console.log({detalles})

  return res.json({detalles})
})

//Vista del carrito:
app.get("/carts/:cid", async (req, res) => {
  const cid = req.params.cid
  const guardar = await dbcartManager.getCarts()
  const Carrito = guardar.find(el => el._id == cid)
  const carritos = await dbcartManager.addProductToCart(Carrito)
  
  console.log({carritos})

  return res.json({carritos})
}) 

app.get("/healthcheck", (req, res) => {
    return res.json({
        status: "Corriendo",
        date: new Date()
    })
})

const chatViewsRouter = viewsRouterFn(io)

/*//descomentar si se quiere usar FS
//Peticion post en la que estoy utilizando "emit"
app.post("/api/products", async(req, res) => {
    const product = req.body
    console.log(product)
    product.id = products.length + 1
    products.push(product)

    await managerDB.addProduct(product)

    io.emit("NuevoProducto", JSON.stringify(product))

    return res.redirect("/realtimeProducts")
})*/


//Expresion regular: donde se codifican como byte utf-8 (á,é,í,ó,ú)⬇                    
app.get("/api/dictionary/:palabra([a-z%C3%A1%C3%A9%C3%AD%C3%B3%C3%BA%C3%BC]+)", (req, res) => {
  return res.send(req.params.palabra)
})


//Mailing:
const transport = nodemailer.createTransport({
  host: process.env.PUERTO,
  service: "gmail",
  port: 587,
  auth: {
    user: 'devjp.010@gmail.com',
    pass: 'yxql uezw dwld qwvb'
  },
  tls: {
    rejectUnauthorized: false
  }
})

app.get("/mail", async (req, res) => {
  const result = await transport.sendMail({
    from: "devjp.010@gmail.com",//Correo del emisor
    to: "devjp.010@gmail.com",//Correo del receptor
    subject: "",//Asunto del correo
    html: `<div>
    <h1>Hola</h1>
    <img src="cid:Pera"/>
    </div>`,//Cuerpo del mensaje
    attachments: [{
      filename: "",//Nombre del archivo(eje: pera.jpg)
      path:"",//ruta de la imagen(eje:./imgs/Pera.jpg)
      cid: ""//Nombre de la imagen(eje: Pera)
    }]
  })
  res.send("Correo enviado")
})

app.use("/api/products", productRouter.getRouter())
app.use("/api/carts", cartRouter.getRouter())
app.use("/", viewsRouter.getRouter())
app.use("/", chatViewsRouter)
app.use("/api/sessions", sessionRouter.getRouter())

module.exports = io