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
}

module.exports = TicketService