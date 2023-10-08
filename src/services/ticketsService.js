const DBTicketManager = require("../dao/DBTicketManager")

class TicketService {
    constructor(){
        this.storage = new DBTicketManager()
    }

    getTickets(){
        return this.storage.getTickets()
    }

    getTicketById(id){
        return this.storage.getTicketById(id)
    }

    generateTicket(body){
        return this.storage.generateTicket(body)
    }
}

module.exports = TicketService