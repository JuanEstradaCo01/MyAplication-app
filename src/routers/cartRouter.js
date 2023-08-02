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

cartRouter.post("/", async(req, res) => {
    /*const data = req.body

    const guardar = await carrito.getCarts()

    data.id = guardar.length + 1
    
    await carrito.addCart(data)*/

    const carts = await dbcartManager.getCarts()

    res.json(carts)
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

    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    
    try{
        const productos = await getCarts()
        const cartById = await carrito.getCartById(cid)      

        if (!cartById) {
            return res.status(404).json({
                error: "No se encontro el carrito"
            })
        }

        const productById = await managerDB.getProductById(pid)
       
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
            if (encontrar >=0){
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
        await carrito.saveCart(products)
        return res.status(201).json(products)
        
    }catch(error) {
        error
    }    
})

module.exports = cartRouter