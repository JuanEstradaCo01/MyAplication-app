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
const TicketRouter = require("./routers/ticketRouter")
const ticketRouter = new TicketRouter()
const userRouter = require("./routers/userRouter")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const FileStore = require("session-file-store")
const MongoStore = require("connect-mongo")
const SessionRouter = require("./routers/sessionRouter")
const sessionRouter = new SessionRouter()
const mockingRouter = require("./routers/mockingPRouter")
const UserRouter = require("./routers/userRouter")
const userrouter = new UserRouter()
const passport = require("passport")
const initializePassport = require ("./config/passport.config")
const flash = require("connect-flash")
const cors = require("cors")
const dotenv = require("dotenv")
const configFn = require("./config")
const DB = require("./config/singleton") 
const ErrorMiddleware = require("./services/middlewares")
const addLogger = require("./utils/loggers")
const {Command} = require("commander")
const swaggerDocs = require("swagger-jsdoc")
const swaggerUiExpress = require("swagger-ui-express")

//DOTENV: 
const program = new Command()

//Por default sera "dev"
program 
  .option('--mode <mode>', 'Modo de trabajo', 'dev',
          '--mode <mode>', 'Modo de trabajo', 'prod')
program.parse()

const options = program.opts()

dotenv.config({
  path: `./.env.${options.mode}`
})

const mode = options.mode

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
app.engine("handlebars", handlebars.engine(
  //Se configura el 'runtimeOptions' para que handlebars acceda a los valores que se le dan
  {runtimeOptions: {
  allowProtoPropertiesByDefault: true,
  allowProtoMethodsByDefault: true
}}))
app.set("views", "./views")
app.set("view engine", "handlebars")


//Levanto el servidor:
const PORT = process.env.PORT || 8080

const httpServer = app.listen(PORT, () => {
    //console.log(`Servidor express escuchando en el puerto ${PORT}`)
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
        /*const nuevoMensaje = {
            usuario: usuario.nombre,
            mensaje
        }
        console.log({Message: nuevoMensaje})

        const message = JSON.stringify(nuevoMensaje)
        
        mensajesArray.push(nuevoMensaje)*/

        io.emit('mensaje', message)
    })
})

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

const authMidleware = (req, res, next) => {
  if (!req.session.username) {
    return res.status(401).send("Necesitas iniciar sesion para continuar")
  }

  return next()
}


app.get("/healthcheck", (req, res) => {
    return res.json({
        status: "Corriendo",
        date: new Date().toLocaleString()
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

//Winston-Logger: 
app.use(addLogger)

app.get("/loggerTest", (req, res) => {
  if(mode === "dev" || "prod"){
    req.logger.debug("❗Debug")
  }
  
  if(mode === "prod"){
    req.logger.info("🛑 Info")
    req.logger.error("❌ Error")
  }
  res.send({message:"Winston-logger"})
})

const swaggerOptions = {
  definition: {
    openapi: "3.0.1",
    info: {
      title: "Documentacion  🌫My aplication",
      description: "API para gestion de ecommerce"
    }
  },
  apis: [`${__dirname}/docs/**/*.yaml`]
}

const specs = swaggerDocs(swaggerOptions)
//Ruta para la documentacion del proyecto en swagger (/apidocs):
app.use("/apidocs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

app.use("/api/products", productRouter.getRouter())
app.use("/api/carts", cartRouter.getRouter())
app.use("/", viewsRouter.getRouter())
app.use("/", chatViewsRouter)
app.use("/api/sessions", sessionRouter.getRouter())
app.use("/api/tickets", ticketRouter.getRouter())
app.use("/", mockingRouter)
app.use("/api/users", userrouter.getRouter())

app.use(ErrorMiddleware)

module.exports = io