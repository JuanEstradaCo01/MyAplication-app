const express = require("express")
const productRouter = require("./routers/productRouter")
const cartRouter = require("./routers/cartRouter")
const viewsRouter = require("./routers/viewsRouter")
const handlebars = require("express-handlebars")
const viewsRouterFn = require("./routers/chatViewsRouter") //chat
const messageRouter = require("./routers/messagesRouter")
const ProductManager = require("./dao/FS/FSProductManager")
const managerDB = new ProductManager("./managerDB.json")
const mongoose = require("mongoose")
const MONGODB_CONNECT = "mongodb+srv://jp010:pasnWqeVnYjKv10W@cluster001.lv2pfsi.mongodb.net/ecommerce?retryWrites=true&w=majority"

mongoose.connect(MONGODB_CONNECT)
  .then(() => console.log("¡Conexion a la DB exitosa!"))
  .catch((e) => console.log(e))

const socketServer = require("./utils/io")

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
            mensaje,
            usuario: usuario.nombre
        }
        mensajesArray.push(nuevoMensaje)

        io.emit('mensaje', JSON.stringify(nuevoMensaje))
    })
})


app.get("/healthcheck", (req, res) => {
    return res.json({
        status: "Corriendo",
        date: new Date()
    })
})

const chatViewsRouter = viewsRouterFn(io)


const products = require("./managerDB.json")

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
app.use("/messages", messageRouter)

module.exports = io