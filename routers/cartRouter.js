const express = require("express")

const CartManager = require("../src/CartManager")

const carrito = new CartManager("../src/carrito.json")

const ProductManager = require("../src/ProductManager")

const managerDB = new ProductManager("../src/managerDB.json")

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

    const data = req.body
    const cid = parseInt(req.params.cid)
    const pid = parseInt(req.params.pid)
    try{
        const carts = await carrito.getCarts()
        const cartById = await carrito.getCartById(cid)

        if (!cartById) {
            return res.status(404).json({
                error: "Not found"
            })
        }

        const productById = await managerDB.getProductById(pid)

        if (!productById) {
            return res.status(404).json({
                error: "Not found"
            })
        }

        const productCar = cartById.product.find(item => item.product === pid)

        if (!productCar) {
            const newProduct = {
                product: pid,
                quantity: 1
            }
            cartById.product.push(newProduct)
        }else {
            productCar.quantity = productCar.quantity + 1 
        }
        const posCart = carts.findIndex(item => item.id === cid)
        carts[posCart].product = cartById.product
        await carrito.addProductToCart(carts)
    }catch(error) {
        error
    }

    return res.status(201).json(data)
})

module.exports = cartRouter