const TicketService = require("../services/ticketsService")

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
        //const cartUser = cartBuscar.name
        //const cartProducts = cartBuscar.products
          
        if (!ticketBuscar) {
            return res.status(404).json({
                error: `No existe ticket con el ID:${cid}`
            })
        }else {
            return res.send({ticketBuscar})
        }
    }
}

module.exports = TicketsController