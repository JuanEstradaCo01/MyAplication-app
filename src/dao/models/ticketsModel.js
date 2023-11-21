const mongoose = require("mongoose")

const collection = "tickets"
const ticketsSchema = mongoose.Schema({
    code: {
        type: Number,
        unique: true
    },  //codigo autogenerable del ticket de compra
    purchase_datetime: {
        type: String,
        default: new Date().toLocaleTimeString()
    },  //fecha y hora
    amount: Number,  //total compra
    purchaser: String //correo del usuario
})

module.exports = mongoose.model(collection, ticketsSchema)