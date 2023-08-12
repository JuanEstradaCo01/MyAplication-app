const mongoose = require("mongoose")

const cartsSchema = mongoose.Schema({
    carrito: Number,
    products: [{
        product: String,
        quantity: Number
    }]
})

module.exports = mongoose.model("carts", cartsSchema)