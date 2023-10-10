const express = require("express")
const saveProducts = require("../utils/generateProduct")

const mockingRouter = express()

mockingRouter.get("/mockingproducts", (req, res) => { 
    let products = []

    for(let i = 0; i <100; i++) {
        products.push(saveProducts())
    }

    const cantidadProductos = products.length
    console.log({cantidadProductos})

    return res.send(products)
})

module.exports = mockingRouter