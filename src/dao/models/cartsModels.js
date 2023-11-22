const mongoose = require("mongoose")
const Schema = require("mongoose")

const cartsSchema = mongoose.Schema({
    name: String,
    products: {
        type: [{
            product: {
                type: Schema.Types.ObjectId,
                ref: "products"
            },
            name: String,
            size: String,
            quantity: Number,
            price: Number,
            totalPrice: {
                type: Number,
                default: 0
            }
        }],
        default: []
    }
    
})

module.exports = mongoose.model("carts", cartsSchema)