const messageModel = require("./models/mensajesModels")

class DBMessagesManager {
    constructor(){
        this.model = messageModel
    }

    getMessages() {
        return this.model.find()
    }
}

module.exports = DBMessagesManager