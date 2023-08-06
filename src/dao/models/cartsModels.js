const mongoose = require("mongoose")

const cartsSchema = mongoose.Schema({
    carrito: Number,
    products: [{}]
})

module.exports = mongoose.model("carts", cartsSchema)