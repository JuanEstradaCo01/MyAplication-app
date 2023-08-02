const mongoose = require("mongoose")

const cartsSchema = mongoose.Schema({
    //id: {type: Number,unique: true}, Desactivo el ID que veniamos manejando ya que mongo proporciona un _id
    products: [
        {product: Number,
        quantity: Number}
    ]
})

module.exports = mongoose.model("carts", cartsSchema)