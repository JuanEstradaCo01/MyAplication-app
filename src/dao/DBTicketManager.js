const ticketsmodel = require("./models/ticketsModel")

class DBTicketManager {
    constructor() {
        this.model = ticketsmodel
    }

    async getTickets () {
        return this.model.find()
    }

    async getTicketById(id) {
        return this.model.findById(id)
    }

    async generateTicket(body) {
        return this.model.create({
            code: body.code || 0,
            purchase_datetime: body.purchase_datetime || new Date().toLocaleDateString(),
            amount: body.amount, 
            purchaser: body.purchaser 
        })
    }
}

module.exports = DBTicketManager