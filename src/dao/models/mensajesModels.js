const mongoose = require("mongoose")

const mensajesSchema = mongoose.Schema({
    usuario: {
        type: String,
        require: true
    },
    mensaje: {
        type: String,
        require: true}
})

module.exports = mongoose.model("messages", mensajesSchema)