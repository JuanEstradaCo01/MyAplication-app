const TicketDto = require("../DTOs/ticketDto")

class TicketRepository {
    constructor(dao) {
        this.dao = dao
    }

    getTickets = async () => {
        const tickets = await this.dao.getTickets()
        return tickets
    }

    generateTicket = async (newTicket) => {
        const ticketToAgregate = new TicketDto(newTicket)
        const ticket = await this.dao.generateTicket(ticketToAgregate)
        return ticket
    }
}

module.exports = TicketRepository