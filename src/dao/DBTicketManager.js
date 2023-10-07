const ticketsmodel = require("./models/ticketsModel")

class DBTicketManager {
    constructor() {
        this.model = ticketsmodel
    }

    async getTickets () {
        return this.model.find()
    }

    async getTicketById() {
        return this.model.findById(id)
    }
}

module.exports= DBTicketManager