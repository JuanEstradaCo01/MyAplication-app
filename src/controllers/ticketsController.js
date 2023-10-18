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
            return res.status(500).json({message: "No existen tickets"}).req.logger.warning("No existen ticke")
        }
    }

    async getTicketById(req, res) {
        const tid = req.params.tid
        try{
            const ticket = await this.service.getTicketById(tid)

            return res.send({ticket})
        }catch(e){
            return res.status(404).json({error: `No existe ticket con el ID:${tid}`}).req.logger.error(`No existe ticket con el ID:${tid}`)
        }
    }

    async generateTicket(req, res) {
        const data = req.body

        const ticketsGenerados = await ticketManager.getTickets()

        data.code = ticketsGenerados.length + 1
        
        const ticketGenerated = await this.service.generateTicket(data)
        
        return res.send({ticketGenerated}).req.logger.info("¡Ticket generado exitosamente!")
    }
}
 
module.exports = TicketsController