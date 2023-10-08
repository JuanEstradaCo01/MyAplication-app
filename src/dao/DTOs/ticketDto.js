class TicketDto {
    constructor(ticket) {
        this.id = ticket.id,
        this.code = ticket.code,
        this.purchase_datetime = ticket.purchase_datetim =
        this.amount = ticket.amount, 
        this.purchaser = ticket.purchaser 
    }
}

module.exports = TicketDto