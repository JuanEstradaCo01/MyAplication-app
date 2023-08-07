const messageModel = require("./models/mensajesModels")

class DBMessagesManager {
    constructor(io){
        this.model = messageModel
        this.io = io
    }

    async getMessages(body) {
        return this.model.create({
            usuario: body.usuario,
            mensaje: body.mensaje
        })
    }
}

module.exports = DBMessagesManager