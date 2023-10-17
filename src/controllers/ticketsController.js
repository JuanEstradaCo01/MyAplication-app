const TicketDto = require("../dao/DTOs/ticketDto")
const TicketRepository = require("../dao/repository/ticketRepository")
const TicketService = require("../services/ticketsService")
const DBTicketManager = require("../dao/DBTicketManager")
const ticketManager = new DBTicketManager()
const ticketRepository = new TicketRepository()

class TicketsController {
    constructor() {
        this.service = new TicketService()
    }

    async getTickets(req, res) {
        try{
            const tickets = await this.service.getTickets()
    
            return res.json(tickets)
        }catch (e) {
            console.log("No existen tickets", e)
        }
    }

    async getTicketById(req, res) {
        const tid = req.params.cid
        
        const ticketBuscar = await this.service.getTicketById(tid)
          
        if (!ticketBuscar) {
            return res.status(404).json({
                error: `No existe ticket con el ID:${cid}`
            })
        }else {
            return res.send({ticketBuscar})
        }
    }

    async generateTicket(req, res) {
        const data = req.body

        const ticketsGenerados = await ticketManager.getTickets()

        data.code = ticketsGenerados.length + 1
        
        const ticketGenerated = await this.service.generateTicket(data)
        
        return res.send({ticketGenerated})
    }
}

module.exports = TicketsController