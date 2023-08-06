const messageModel = require("./models/mensajesModels")

class DBMessagesManager {
    constructor(io){
        this.model = messageModel
        this.io = io
    }

    async getMessages(body) {
        return this.model.create({
            user: body.user,
            message: body.message
        })
    }
}

module.exports = DBMessagesManager