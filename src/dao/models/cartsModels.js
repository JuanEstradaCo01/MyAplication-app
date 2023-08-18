const mongoose = require("mongoose")
const Schema = require("mongoose")

const cartsSchema = mongoose.Schema({
    carrito: Number,
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },
            quantity: Number
        }],
        default: []
    }
    
})

module.exports = mongoose.model("carts", cartsSchema)