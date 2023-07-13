const express = require("express")

const CartManager = require("../controllers/CartManager.js")

const carrito = new CartManager("../carrito.json")

const ProductManager = require("../controllers/ProductManager.js")


const managerDB = new ProductManager("../managerDB.json")

const { Router } = express

const cartRouter = Router()

cartRouter.post("/", async(req, res) => {
    const data = req.body

    const guardar = await carrito.getCarts()

    data.id = guardar.length + 1
    
    await carrito.addCart(data)

    return res.status(201).json(data)
})

cartRouter.get("/:cid", async(req, res) => {

    const Id = parseInt(req.params.cid)

    const cartBuscar = await carrito.getCartById(Id)
  
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