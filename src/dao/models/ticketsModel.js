const mongoose = require("mongoose")

const collection = "tickets"
const ticketsSchema = mongoose.Schema({
    code: String,  //codigo autogenerable
    purchase_datetime: {
        type: Date,
        default: Date.now
    },  //fecha y hora
    amount: Number,  //total compra
    purchaser: String  //correo del usuario
})

module.exports = mongoose.model(collection, ticketsSchema)