const mongoose = require("mongoose")

const mensajesSchema = mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true}
})

module.exports = mongoose.model("messages", mensajesSchema)