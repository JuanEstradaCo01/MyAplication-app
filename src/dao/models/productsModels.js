const mongoose = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productsSchema = mongoose.Schema({
    id: Number,
    tittle: String,
    description: {
        type: String,
        enum: ["pequeño","mediano","grande"],
        default: "mediano"
    },
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

productsSchema.plugin(mongoosePaginate)

module.exports = mongoose.model("products", productsSchema)