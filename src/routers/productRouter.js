//const managerDB = new ProductManager("./managerDB.json") //Para usar FS
const BaseRouter = require("./BaseRouter")
const ProductsController = require("../controllers/productsController")
const productsController = new ProductsController()
const uploadProduct = require("../uploads/uploadProduct")

class ProductRouter extends BaseRouter {
    init () {
        this.get("/", productsController.getProducts.bind(productsController))
        
        this.get("/:pid", productsController.getProductById.bind(productsController))
        
        this.post("/",uploadProduct.single("file"),productsController.addProduct.bind(productsController))   
        
        this.put("/:pid", productsController.updateProduct.bind(productsController))
        
        this.delete("/:pid/api/users/:uid", productsController.deleteProduct.bind(productsController))
    }
}

module.exports = ProductRouter

