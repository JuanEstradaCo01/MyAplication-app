const CartsService = require("../services/cartsService")
const DBProductManager = require("../dao/DBProductManager")
const dbproductManager = new DBProductManager()

class CartsController {
    constructor() {
        this.service = new CartsService()
    }

    async getCarts(req, res) {
        try{
            const products = await this.service.getCarts()
    
            return res.json(products)
        }catch (e) {
            console.log("No existen carritos", e)
        }
    }

    async getCartById(req, res) {
        const cid = req.params.cid
        
        const cartBuscar = await this.service.getCartById(cid)
        const user = cartBuscar.name
        const products = cartBuscar.products
          
        if (!cartBuscar) {
            return res.status(404).json({
                error: `No existe el carrito con el ID:${cid}`
            })
        }else {
            return res.json(cartBuscar)
        }
    }

    async addCart(req, res) {
        const data = req.body
        
        await this.service.addCart(data)
        
        return res.json(data)
    }

    async addProductToCart(req, res) {
        const cid = req.params.cid 
        const pid = req.params.pid 

        try{
            const product = await dbproductManager.getProductById(pid)

            if (!product) {
                return res.status(404).json({
                    error: "No se encontro el producto"
                })
            }   
    
            const productToAgregate = {
                id: product._id,
                name: product.tittle,
                quantity: 1
            }
            const cart = await this.service.getCartById(cid)
    
            if (!cart) {
                return res.status(404).json({
                    error: "No se encontro el carrito"
                })
            }
    
            
            if (cart.products.length === 0 ){
                cart.products.push(productToAgregate)
            }else{
                const encontrar = cart.products.findIndex(item => item.id === pid)
                console.log({encontrar})
                if (encontrar >= 0){
                    cart.products[encontrar].quantity = cart.products[encontrar].quantity + 1
                }else{
                    cart.products.push(productToAgregate)
                }
            }
    
            await this.service.addProductToCart(cid, cart)
            return res.status(201).json(cart)
            //res.send({status: "success", result:"Product Added"})
        }catch(error) {
            console.log("Ha ocurrido un error", error)
        }
    }

    async deleteProductInCart(req, res) {
        const pid = req.params.pid
        const cid = req.params.cid
        try {
            const products = await this.service.getProducts()
            const cart = products.find(el => el._id === cid)
            const cartProducts = cart.products
            const productToDelete = cartProducts.find(el => el._id === pid)
            const name = productToDelete.tittle
                
            await this.service.deleteProductInCart(productToDelete)
        
            return res.status(200).json({OK: `Se ha eliminado el producto ${name} del carrito`})
        }catch (e) {
            return res.status(404).json({mensaje: "No existe el producto en el carrito"})
        }
    }

    async updateCart(req, res) {
        const data = req.body
        const id = req.params.cid

        await this.service.updateCart(id, data)
        return res.status(200).json(data)
    }

    async updateQuantity(req, res) {
        const body = req.body
        const id = req.params.cid

        await this.service.updateQuantity(id, body)
        return res.status(200).json(body)
    }

    async deleteCart(req, res) {
        const id = req.params.cid
        
        try{
            const carts = await this.service.getCarts()
            const cartToDelete = carts.find(el => el._id == id)
            const name = cartToDelete.name
            const cart = await this.service.deleteCart(id)
        
            return res.status(200).json({OK: `Se ha eliminado el carrito ${name}`})
        }catch (e) {
            return res.status(404).json({error: "No existe el carrito"})
        }
    }
}

module.exports = CartsController