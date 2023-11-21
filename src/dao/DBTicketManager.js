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
            code: body.code,
            purchase_datetime: body.purchase_datetime,
            amount: body.amount, 
            purchaser: body.purchaser 
        })
    }
}

module.exports = DBTicketManager