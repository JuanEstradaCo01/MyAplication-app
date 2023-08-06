const express = require("express")
//const CartManager = require("../dao/FS/FSCartManager.js") --> Para FS
//const carrito = new CartManager("../carrito.json") --> para FS
//const ProductManager = require("../dao/FS/FSProductManager.js") --> para FS
//const managerDB = new ProductManager("../managerDB.json") --> para FS
const { Router } = express
const cartRouter = Router()


const DBProductManager = require("../dao/DBProductManager")
const dbproductManager = new DBProductManager() //Para usar mongo
const DBCartManager = require("../dao/DBCartManager")
const dbcartManager = new DBCartManager()// Para usar mongo


//NOTA: Descomentar todo lo que este comentado si se quiere usar FS

cartRouter.get("/", async(req, res) => {
    try{
        const products = await dbcartManager.getCarts()

        return res.json(products)
    }catch (e) {
        console.log("No existen carritos", e)
    }
    
})

cartRouter.post("/", async(req, res) => {
    /*const data = req.body

    const guardar = await carrito.getCarts()

    data.id = guardar.length + 1
    
    await carrito.addCart(data)*/
    const body = req.body

    const guardar = await dbcartManager.getCarts()

    body.carrito = guardar.length + 1

    await dbcartManager.addCart(body)

    res.json(body)
})

cartRouter.get("/:cid", async(req, res) => {

    const cid = req.params.cid //convertirlo con parseInt cuando se quiera usar FS

    const cartBuscar = await dbcartManager.getCartById(cid)
  
    if (!cartBuscar) {
        return res.status(404).json({
            error: `No existe el carrito con el ID:${Id}`
        })
    }else {
        return res.send(cartBuscar)
    }
})

cartRouter.post("/:cid/products/:pid", async(req, res) => {

    const cid = req.params.cid //convertirlo con parseInt cuando se quiera usar FS
    const pid = req.params.pid //convertirlo con parseInt cuando se quiera usar FS
    
    try{
        const cartById = await dbcartManager.getCartById(cid)  

        if (!cartById) {
            return res.status(404).json({
                error: "No se encontro el carrito"
            })
        }

        const productById = await dbproductManager.getProductById(pid)


        if (!productById) {
            return res.status(404).json({
                error: "No se encontro el producto"
            })
        }      
       
        if (cartById.products.length === 0 ){
            const newProduct = {
                product: pid,
                quantity: 1
            }
            cartById.products.push(newProduct)
        }else{
            const encontrar = cartById.products.findIndex(item => item.product === pid)
            if (encontrar >= 0){
                cartById.products[encontrar].quantity = cartById.products[encontrar].quantity + 1
            }else{
                const newProduct = {
                    product: pid,
                    quantity: 1
                }
                cartById.products.push(newProduct)
            }
        }
        const products = []
        products.push(cartById)   
        console.log(cartById)   

        await dbcartManager.addProductToCart(cartById)
        

        return res.status(201).json(cartById)
        
    }catch(error) {
        console.log("Ha ocurrido un error", error)
    }

})

module.exports = cartRouter