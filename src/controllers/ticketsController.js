const TicketService = require("../services/ticketsService")
const DBCartManager = require("../dao/DBCartManager")
const cartDao = new DBCartManager()
const DBUserManager = require("../dao/DBUserManager")
const userDao = new DBUserManager()

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
        try{
            const uid = req.session.passport.user
            const user = await userDao.getUserById(uid)
            const cid = user.cart
            const cart = await cartDao.getCartById(cid)
            const cartProducts = cart.products

            const data = req.body
            const tickets = await this.service.getTickets()  
            const date = new Date().toLocaleString()
    

            cart.products.forEach(function (item) {
                item.totalAllQuantity = item.quantity * item.price
            })

            //Logica para calcular los datos del ticket:
            const prices = cartProducts.reduce((item, price) => item + price.totalAllQuantity, 0)

            data.totalPrices = prices
            const iva = prices * 0.19
            let totalBuy = prices + iva
            totalBuy = Number(totalBuy.toFixed(2))
            data.amount = totalBuy
            data.code = tickets.length + 1 
            data.purchase_datetime = date
            data.purchaser = user.email

            await cartDao.updateCart(cid, cart)
            
            await this.service.generateTicket(data)
            
            req.logger.info("¡Ticket generado exitosamente!")
            return res.render("ticket", {data, cartProducts})
        }catch(e){
            req.logger.error("Ha ocurrido un error al generar el ticket")
            return res.status(500).json({error: "Ha ocurrido un error al generar el ticket"})
        }
    }
}
 
module.exports = TicketsController