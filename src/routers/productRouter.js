const express = require("express")

const ProductManager = require("../controllers/ProductManager")
const uploader = require("../utils")
//const io = require("../app")
const init = require("../utils/io")

const managerDB = new ProductManager("./managerDB.json")

const { Router } = express

const productRouter = Router()

const io = init()

productRouter.get("/", async (req, res, ) =>  {

    try {
        const productos = await managerDB.getProducts()
        
        const limite = parseInt(req.query.limit)

        if ( isNaN(limite)) {
            res.json(productos)
        }else {
            res.json(productos.slice(0, limite))
        }

    }catch (err){
        console.log("No existen productos", err)
    }
})

productRouter.get("/:pid", async(req, res) => {

    const Id = parseInt(req.params.pid)

    const productBuscar = await managerDB.getProductById(Id)
  
    if (!productBuscar) {
        return res.send({})
    }else {
        return res.send(productBuscar)
    }
})

productRouter.post("/", async(req, res) => {
    const data = req.body
    const guardar = await managerDB.getProducts()

    data.id = guardar.length + 1
    //data.path = req.file.originalname

    await managerDB.addProduct(data)

    io.emit("NuevoProducto", JSON.stringify(data))
   
    return res.status(201).json(data)
})


productRouter.put("/:pid", async(req, res) => {
    const data = req.body

    const pid = parseInt(req.params.pid)

    const guardar = await managerDB.getProducts()

    const product = guardar.find( item => item.id === pid)

    if (!product) {
        return res.status(404).json({
            error: "Producto no encontrado"
        })
    }

    //Campos a modificar

    product.tittle = data.tittle || product.tittle
    product.description = data.description || product.description
    product.price = data.price || product.price
    product.thumbnail = product.thumbnail
    product.stock = data.stock || product.stock

    const modificar = await managerDB.updateProduct(pid, product)

    return res.json(product)
})

productRouter.delete("/:pid", async(req, res) => {

    const pid = parseInt(req.params.pid)

    const guardar = await managerDB.getProducts()

    const productIndex = guardar.findIndex( item => item.id === pid)

    if (productIndex === -1) {
        return res.status(404).json({
            error: "!Producto no encontrado!"
        })
    }

    guardar.splice(productIndex, 1)

    return res.json({
        ok: "Producto eliminado"
    })
})

module.exports = productRouter

