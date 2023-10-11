const TicketsController = require("../controllers/ticketsController")
const ticketsController = new TicketsController()
const BaseRouter = require("./BaseRouter")

class TicketRouter extends BaseRouter {
    init () {
        this.get("/", ticketsController.getTickets.bind(ticketsController))
        this.get("/:tid", ticketsController.getTicketById.bind(ticketsController))
        this.post("/", ticketsController.generateTicket.bind(ticketsController))
    }
}

module.exports = TicketRouter