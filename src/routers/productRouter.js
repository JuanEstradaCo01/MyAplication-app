const express = require("express")
const ProductManager = require("../dao/FS/FSProductManager")
const uploader = require("../utils/multer")
const init = require("../utils/io")
//const managerDB = new ProductManager("./managerDB.json") //Para usar FS
const { Router } = express
const productRouter = Router()
const DBProductManager = require("../dao/DBProductManager")
const BaseRouter = require("./BaseRouter")
const dbproductManager = new DBProductManager() //Para usar mongo
const ProductsController = require("../controllers/productsController")
const productsController = new ProductsController()

class ProductRouter extends BaseRouter {
    init () {
        this.get("/", productsController.getProducts.bind(productsController))
        
        this.get("/:pid", productsController.getProductById.bind(productsController))
        
        this.post("/", productsController.addProduct.bind(productsController))   
        
        this.put("/:pid", productsController.updateProduct.bind(productsController))
        
        this.delete("/:pid/api/users/:uid", productsController.deleteProduct.bind(productsController))
    }
}

module.exports = ProductRouter

