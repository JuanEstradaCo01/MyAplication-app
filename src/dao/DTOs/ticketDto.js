class TicketDto {
    constructor(ticket) {
        this.code = ticket.code,
        this.purchase_datetime = ticket.purchase_datetime,
        this.amount = ticket.amount, //Total compra
        this.purchaser = ticket.purchaser //Correo del usuario
    }
}

module.exports = TicketDto