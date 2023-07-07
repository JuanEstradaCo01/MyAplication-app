const express = require("express")

const CartManager = require("../src/CartManager")

const carrito = new CartManager("../src/carrito.json")

const { Router } = express

const cartRouter = Router()

const carrito01 = require("../src/carrito.json")

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

cartRouter.post("/cid/products/pid", async(req, res) => {
    const data = req.body

    
    return res.status(201).json(data)
})

module.exports = cartRouter