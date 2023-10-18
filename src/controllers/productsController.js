const ProductsService = require("../services/productsService")
const ProductDto = require("../dao/DTOs/productDto")
const productRepository = require("../services/index")
const DBCartManager = require("../dao/DBCartManager")
const cartmanager = new DBCartManager()
const CustomError = require("../services/errors/CustomError")
const generateProductErrorInfo = require("../services/errors/info")
const EErrors = require("../services/errors/enums")


class ProductsController {
    constructor() {
        this.service = new ProductsService()
    }

    async getProducts(req, res) {

        try {
            const productos = await productRepository.getProducts()
            
            const limite = parseInt(req.query.limit)
    
            if ( isNaN(limite)) {
                res.json(productos)
            }else {
                res.json(productos.slice(0, limite))
            }
    
        }catch (err){
            return res.status(404).json({error: "No existen productos en la base de datos"}).req.logger.error("No existen productos en la base de datos")
        }
    }

    async getProductById(req, res) {

        try{
            const pid = req.params.pid
        
            const productBuscar = await this.service.getProductById(pid)
            return res.json(productBuscar)

        }catch(e){
            return res.status(404).json({error: "El producto no existe en la base de datos"}).req.logger.error("El producto no existe en la base de datos")
        }
    }

    async addProduct(req, res, next) {

        try{
            let {id,tittle,description,price,thumbnail,code,status,stock,category} = req.body
        

            //Valido si las propiedades del producto llegan invalidas segun su "TYPE" y genero un CustomError:
            if(!id || !tittle || !description || !price || !thumbnail || !code || !status || !stock || !category) {
                const error = CustomError.generateError({
                    name: "Error en la creacion del producto",
                    cause: generateProductErrorInfo({id,tittle,description,price,thumbnail,code,status,stock,category}),
                    message: "Error al tratar de agregar el producto",
                    code: EErrors.INVALID_TYPES_ERROR
                })
                return next(error)
            }
 
            const guardar = await productRepository.getProducts()
        
            code = guardar.length + 1 
            id = guardar.length + 1 
        
            const product = new ProductDto({id,tittle,description,price,thumbnail,code,status,stock,category})

            const productoCreado = await productRepository.addProduct(product)
 
            return res.json({productoCreado}).req.logger.info(`✔ ¡Producto agregado exitosamente!(${productoCreado.tittle})`)
        }catch(e){
            return res.status(500).json({error: "No se pudo crear el producto"}).req.logger.error("No se pudo crear el producto")
        }

    }

    async updateProduct(req, res) {

        const body = req.body
        
        const pid = req.params.pid

        const guardar = await this.service.getProducts()
        
        body.code = guardar.length
        
        const update = await this.service.updateProduct(pid, body)

        if(!update) {
            return res.status(500).json({error: "No se pudo actualizar el producto"}).req.logger.warning("No se pudo actualizar el producto")
        }

        return res.json(update)
    }

    async deleteProduct(req, res) {

        const pid = req.params.pid
        
        try {
            const products = await this.service.getProducts()
            const productToDelete = products.find(el => el._id == pid)
            const name = productToDelete.tittle
            await this.service.deleteProduct(pid)
            
            return res.json({OK: `Se ha eliminado el producto (${name})`}).req.logger.info(`Se ha eliminado el producto (${name})`)
        }catch (e) {
            return res.status(404).json({message: "No existe el producto a eliminar"}).req.logger.warning("No existe el producto a eliminar")
        }   
    }
}

module.exports = ProductsController