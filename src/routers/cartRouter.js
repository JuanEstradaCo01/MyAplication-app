//const CartManager = require("../dao/FS/FSCartManager.js") --> Para FS
//const carrito = new CartManager("../carrito.json") --> para FS
//const ProductManager = require("../dao/FS/FSProductManager.js") --> para FS
//const managerDB = new ProductManager("../managerDB.json") --> para FS
const DBProductManager = require("../dao/DBProductManager")
const dbproductManager = new DBProductManager() //Para usar mongo
const DBCartManager = require("../dao/DBCartManager")
const BaseRouter = require("./BaseRouter")
const dbcartManager = new DBCartManager()// Para usar mongo
const CartsController = require("../controllers/cartsController")
const cartsController = new CartsController()


class CartRouter extends BaseRouter {
    init () {
        this.get("/", cartsController.getCarts.bind(cartsController))
        this.get("/:cid", cartsController.getCartById.bind(cartsController))
        this.post("/", cartsController.addCart.bind(cartsController))
        this.post("/:cid/products/:pid", cartsController.addProductToCart.bind(cartsController))
        this.put("/:cid", cartsController.updateCart.bind(cartsController))
        this.put("/:cid/products/:pid",  cartsController.updateQuantity.bind(cartsController))
        this.delete("/:cid/products/:pid", cartsController.deleteProductInCart.bind(cartsController))
        this.delete("/:cid", cartsController.deleteCart.bind(cartsController))
    }
}

module.exports = CartRouter