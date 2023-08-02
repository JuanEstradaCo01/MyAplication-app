const mongoose = require("mongoose")


const productsSchema = mongoose.Schema({
    tittle: String,
    description: String,
    price: Number,
    thumbnail: String, //(sin imagen)
    code: {
        type: String,
        unique: true
    },
    status: Boolean,
    stock: Number,
    category: String
})

module.exports = mongoose.model("products", productsSchema)