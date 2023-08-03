const mongoose = require("mongoose")

const mensajesSchema = mongoose.Schema({
    user: String,
    message: String
})

module.exports = mongoose.model("messages", mensajesSchema)