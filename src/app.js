const express = require("express")
const productRouter = require("./routers/productRouter")
const cartRouter = require("./routers/cartRouter")
const viewsRouter = require("./routers/viewsRouter")
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
const mongoose = require("mongoose")
const MONGODB_CONNECT = "mongodb+srv://jp010:pasnWqeVnYjKv10W@cluster001.lv2pfsi.mongodb.net/ecommerce?retryWrites=true&w=majority"



//IIFE
;(async () => {
    await mongoose.connect(MONGODB_CONNECT)
      .then(() => console.log("¡Conexion a MongoDB exitosa!"))
      .catch((e) => console.log(e))

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

})()



const socketServer = require("./utils/io")
const DBProductManager = require("./dao/DBProductManager")

const app = express()


//NOTA: Para agregar productos ir a (/realtimeProducts) que nos muestra el formulario y la lista de productos la cual funciona en tiempo real al agregar un producto



//Configuracion basica
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))





//app.use("/static", express.static("public"))


//configurando handlebars
app.engine("handlebars", handlebars.engine())
app.set("views", "./views")
app.set("view engine", "handlebars")



const puerto = 8080

const httpServer = app.listen(puerto, () => {
    console.log(`Servidor espress escuchando en el puerto ${puerto}`)
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


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter)
app.use("/", chatViewsRouter)

module.exports = io