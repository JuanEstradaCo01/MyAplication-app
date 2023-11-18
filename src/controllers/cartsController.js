const CartsService = require("../services/cartsService")
const DBProductManager = require("../dao/DBProductManager")
const dbproductManager = new DBProductManager()
const productsModels = require("../dao/models/productsModels")
const UserManager = require("../dao/DBUserManager")
const usermanager = new UserManager()

class CartsController {
    constructor() {
        this.service = new CartsService()
    }
 
    async getCarts(req, res) {
        try{
            const products = await this.service.getCarts()
    
            return res.json(products)
        }catch (e) {
            return res.status(404).json({error: "No existen carritos"}).req.logger.error("No existen carritos")
        }
    }

    async getCartById(req, res) {
        const cid = req.params.cid
        try{

            const cartBuscar = await this.service.getCartById(cid) 
            const cartName = cartBuscar.name
            const cartProducts = cartBuscar.products 
            const totalPrices =  60
            const iva = totalPrices * 0.19
            const totalBuy = totalPrices + iva
        
            if(!cartBuscar){
                return res.status(404).json({error: `No existe el carrito`}).req.logger.error(`No existe el carrito`)
            }
        
            return res.render("cart", {cartName, cartProducts, totalBuy})
        }catch(e){
            return res.status(404).json({error: `No existe el carrito con el ID:${cid}`}).req.logger.error(`No existe el carrito con el ID:${cid}`)
        }
    }

    async addCart(req, res) {
        const data = req.body
        
        await this.service.addCart(data)
        
        return res.json(data).req.logger.info("✔ ¡Carrito creado!")
    }

    async addProductToCart(req, res) {
        const cid = req.params.cid 
        const pid = req.params.pid 

        try{
            const product = await dbproductManager.getProductById(pid)

            //Valido si el producto que se quiere agregar es del usuario actual y si él lo creo, en ese caso no se permite agregar:
            const users = await usermanager.getUsers()
            const user = users.find(item=>item.cart._id == cid)
            if(user.typeCount === "Premium" && product.owner === user.email){
                return res.status(500).json({error: "No puedes agregar un producto que te pertenece"}).req.logger.error("No puedes agregar un producto que te pertenece")
            }


            if (!product) {
                return res.status(404).json({error: "No se encontro el producto a agregar al carrito"}).req.logger.error("No se encontro el producto a agregar al carrito")
            }   
    
            const productToAgregate = {
                id: product._id,
                name: product.tittle,
                size: product.description,
                quantity: 1,
                price: product.price
            }
            const cart = await this.service.getCartById(cid)
    
            if (!cart) {
                return res.status(404).json({error: "No se encontro el carrito"}).req.logger.error("No se encontro el carrito")
            }
    
            
            if (cart.products.length === 0 ){
                cart.products.push(productToAgregate)
            }else{
                const encontrar = cart.products.findIndex(item => item.id === pid)
                if (encontrar >= 0){
                    cart.products[encontrar].quantity = cart.products[encontrar].quantity + 1
                }else{
                    cart.products.push(productToAgregate)
                }
            }

            const nombre = product.tittle
            const tamaño = product.description
            const code = product.code
            const precio = product.price
            const cartId = cart._id
            
    
            await this.service.addProductToCart(cid, cart)
            req.logger.info(`¡Producto agregado exitosamente al carrito!(${nombre})`)
            return res.render("addProduct", {nombre, tamaño, code, precio, cartId})
            //res.send({status: "success", result:"Product Added"})
        }catch(error) {
            return res.status(500).json({error: "Ha ocurrido un error al agregar el producto al carrito"}).req.logger.fatal("Ha ocurrido un error al agregar el producto al carrito")
        }
    }

    async deleteProductInCart(req, res) {
        const pid = req.params.pid
        const cid = req.params.cid
        try {
            const product = await dbproductManager.getProductById(pid)

            if(!product){
                return res.status(404).json({error: "No se encontro el producto"}).req.logger.error("No se encontro el producto")
            }

            const cart = await this.service.getCartById(cid)

            if(!cart){
                return res.status(404).json({error: "No se encontro el carrito"}).req.logger.error("No se encontro el carrito")
            }

            await this.service.deleteProductInCart(pid, cart)
        
            return res.status(200).json({OK: `Se ha eliminado el producto ${product.tittle} del carrito`}).req.logger.info(`Se ha eliminado el producto ${product.tittle} del carrito`)
        }catch (e) {
            return res.status(500).json({message: "Ha ocurrido un error"}).req.logger.warning("Ha ocurrido un error")
        }
    }

    async updateCart(req, res) {
        const data = req.body
        const id = req.params.cid

        await this.service.updateCart(id, data)
        return res.status(200).json(data).req.logger.info("¡Carrito actualizado exitosamente!")
    }

    async updateQuantity(req, res) {
        const body = req.body
        const id = req.params.cid

        await this.service.updateQuantity(id, body)
        return res.status(200).json(body).req.logger.info("¡Cantidad actualizada correctamente!")
    }

    async deleteCart(req, res) {
        const id = req.params.cid
        
        try{
            const carts = await this.service.getCarts()
            const cartToDelete = carts.find(el => el._id == id)
            const name = cartToDelete.name
            const cart = await this.service.deleteCart(id)
        
            return res.status(200).json({OK: `Se ha eliminado el carrito ${name}`}).req.logger.info(`Se ha eliminado el carrito ${name}`)
        }catch (e) {
            return res.status(404).json({error: "No existe el carrito a eliminar"}).req.logger.error("No existe el carrito a eliminar")
        }
    }
}

module.exports = CartsController