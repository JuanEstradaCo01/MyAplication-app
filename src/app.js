const express = require("express")
const productRouter = require("./routers/productRouter")
const cartRouter = require("./routers/cartRouter")
const viewsRouter = require("./routers/viewsRouter")
const handlebars = require("express-handlebars")
const ProductManager = require("./controllers/ProductManager")
const managerDB = new ProductManager("./managerDB.json")

const socketServer = require("./utils/io")

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))




//Para agregar mediante un formulario por el front
app.use("/static", express.static("public"))




//configurando handlebars
app.engine("handlebars", handlebars.engine())

app.set("views", "./views")

app.set("view engine", "handlebars")




app.use(express.static("public"))

const puerto = 8080

const httpServer = app.listen(puerto, () => {
    console.log(`Servidor espress escuchando en el puerto ${puerto}`)
})

const io = socketServer(httpServer)

//Agregar producto enviado desde el formulario (/static) o desde postman

const products = require("./managerDB.json")

//Peticion post en la que estoy utilizando "emit"
app.post("/api/products", async(req, res) => {
    const product = req.body
    console.log(product)
    product.id = products.length + 1
    products.push(product)

    await managerDB.addProduct(product)

    io.emit("NuevoProducto", JSON.stringify(product))

    return res.status(201).json(product)
})


app.use("/api/products", productRouter)
app.use("/api/carts", cartRouter)
app.use("/", viewsRouter)

module.exports = io