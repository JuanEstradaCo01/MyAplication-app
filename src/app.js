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
const mongoose = require("mongoose")
const MONGODB_CONNECT = "mongodb+srv://jp010:pasnWqeVnYjKv10W@cluster001.lv2pfsi.mongodb.net/ecommerce?retryWrites=true&w=majority"



//IIFE
;(async () => {
    await mongoose.connect(MONGODB_CONNECT)
      .then(() => console.log("¡Conexion a MongoDB exitosa!"))
      .catch((e) => console.log(e))

    //Productos a agregar:
    /*await productsmodels.insertMany([
        {
          tittle: "papaya",
          description: "mediano",
          price: 10,
          thumbnail: "Sin imagen",
          code: "abc0001",
          status: true,
          stock: 300,
          category: "fruta"
        },
        {
          tittle: "manzana",
          description: "mediano",
          price: 9,
          thumbnail: "Sin imagen",
          code: "abc0002",
          status: true,
          stock: 20,
          category: "fruta"
        },
        {
          tittle: "sandia",
          description: "grande",
          price: 10,
          thumbnail: "Sin imagen",
          code: "abc0003",
          status: true,
          stock: 300,
          category: "fruta"
        },
        {
          tittle: "papaya",
          description: "pequeño",
          price: 25,
          thumbnail: "Sin imagen",
          code: "abc0004",
          status: true,
          stock: 76,
          category: "fruta"
        },
        {
          tittle: "banano",
          description: "pequeño",
          price: 5,
          thumbnail: "Sin imagen",
          code: "abc0005",
          status: true,
          stock: 150,
          category: "fruta"
        },
        {
          tittle: "fresa",
          description: "pequeño",
          price: 3,
          thumbnail: "Sin imagen",
          code: "abc0006",
          status: true,
          stock: 250,
          category: "fruta"
        },
        {
          tittle: "guanabana",
          description: "mediano",
          price: 14,
          thumbnail: "Sin imagen",
          code: "abc0007",
          status: true,
          stock: 90,
          category: "fruta"
        },
        {
          tittle: "coco",
          description: "grande",
          price: 13,
          thumbnail: "Sin imagen",
          code: "abc0008",
          status: true,
          stock: 120,
          category: "fruta"
        },
        {
          tittle: "lulo",
          description: "pequeño",
          price: 2.5,
          thumbnail: "Sin imagen",
          code: "abc0009",
          status: true,
          stock: 500,
          category: "fruta"
        },
        {
          tittle: "ciruela",
          description: "pequeño",
          price: 5,
          thumbnail: "Sin imagen",
          code: "abc00010",
          status: true,
          stock: 300,
          category: "fruta"
        },
        {
          tittle: "lenteja",
          description: "pequeño",
          price: 10,
          thumbnail: "Sin imagen",
          code: "abc00011",
          status: true,
          stock: 500,
          category: "grano"
        },
        {
          tittle: "mango",
          description: "mediano",
          price: 7,
          thumbnail: "Sin imagen",
          code: "abc00012",
          status: true,
          stock: 90,
          category: "fruta"
        },
        {
          tittle: "uva",
          description: "pequeño",
          price: 2,
          thumbnail: "Sin imagen",
          code: "abc00013",
          status: true,
          stock: 200,
          category: "fruta"
        },
        {
          tittle: "aguacate",
          description: "mediano",
          price: 15,
          thumbnail: "Sin imagen",
          code: "abc00014",
          status: true,
          stock: 100,
          category: "fruta"
        },
        {
          tittle: "tomate",
          description: "pequeño",
          price: 1.5,
          thumbnail: "Sin imagen",
          code: "abc00015",
          status: true,
          stock: 500,
          category: "fruta"
        },
        {
          tittle: "limon",
          description: "pequeño",
          price: 1,
          thumbnail: "Sin imagen",
          code: "abc00016",
          status: true,
          stock: 500,
          category: "fruta"
        },
        {
          tittle: "piña",
          description: "grande",
          price: 10,
          thumbnail: "Sin imagen",
          code: "abc00017",
          status: true,
          stock: 100,
          category: "fruta"
        },
        {
          tittle: "cebolla",
          description: "mediano",
          price: 2,
          thumbnail: "Sin imagen",
          code: "abc00018",
          status: true,
          stock: 50,
          category: "verdura"
        },
        {
          tittle: "mandarina",
          description: "pequeño",
          price: 2.5,
          thumbnail: "Sin imagen",
          code: "abc00019",
          status: true,
          stock: 250,
          category: "fruta"
        },
        {
          tittle: "zanahoria",
          description: "mediano",
          price: 4,
          thumbnail: "Sin imagen",
          code: "abc00020",
          status: true,
          stock: 100,
          category: "verdura"
        }
      ])*/
      const prod = await productsmodels.aggregate([
        {
          $match: { description: "mediano" }
        },{
          $sort: { price: 1 }
        }
      ])

      //Vista de los productos paginados
      app.get("/productspaginate", async ( req, res) => {
        const limit = 10
        const page = req.query.page || 1

        const products = await productsmodels.paginate({ }, { limit, page})

        products.docs = products.docs.map(user => user.toObject())

        return res.render("productsPaginate", products)
      })

})()



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
            usuario: usuario.nombre,
            mensaje
        }
        console.log({Message: nuevoMensaje})

        const message = JSON.stringify(nuevoMensaje)
        
        mensajesArray.push(nuevoMensaje)

        io.emit('mensaje', message)
    })
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