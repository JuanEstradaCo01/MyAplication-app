const ProductsService = require("../services/productsService")
const ProductDto = require("../dao/DTOs/productDto")
const productRepository = require("../services/index")
const DBCartManager = require("../dao/DBCartManager")
const cartmanager = new DBCartManager()
const CustomError = require("../services/errors/CustomError")
const generateProductErrorInfo = require("../services/errors/info")
const EErrors = require("../services/errors/enums")
const passport = require("passport")


const passportCall = (strategy) => {
  return (req, res, next) => {
    passport.authenticate(strategy, (err, user, info) => {
      if (err) {
        return next(err)
      }

      if (!user) {
        return res.status(401).json({
          error: info.messages ? info.messages : info.toString()
        })
      }

      req.user = user

      return next()
    })(req, res, next)
  }
}


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

    async addProduct(req, res, next){
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

            //Busco el usuario que creo el producto (solo deja crear el producto si se esta logueado)
            passportCall("jwt")
            if(req.user.email === "adminCoder@coder.com"){
                product.owner = "Admin"
                const productoCreado = await productRepository.addProduct(product)
 
                return res.json({productoCreado}).req.logger.info(`✔ ¡Producto agregado exitosamente!(${productoCreado.tittle})`)
            }

            product.owner = req.user.email
            
            const productoCreado = await productRepository.addProduct(product)
 
            return res.json({productoCreado}).req.logger.info(`✔ ¡Producto agregado exitosamente!(${productoCreado.tittle})`)
        }catch(e){
            return res.status(500).json({error: "No se pudo crear el producto, logueate! solo el Admin o un usuario Premium pueden crear productos"}).req.logger.error("No se pudo crear el producto, logueate! solo el Admin o un usuario Premium pueden crear productos")
        }

    }

    async updateProduct(req, res) {

        let {tittle,description,price,thumbnail,code,status,stock,category} = req.body
        
        const pid = req.query.pid || req.params.pid

        const guardar = await this.service.getProducts()
        
        code = guardar.length + 1
        
        const update = await this.service.updateProduct(pid, {tittle,description,price,thumbnail,code,status,stock,category})

        if(!update) {
            return res.status(500).json({error: "No se pudo actualizar el producto"}).req.logger.warning("No se pudo actualizar el producto")
        }

        return res.json(update)
    }

    async deleteProduct(req, res) {

        const pid = req.params.pid
        //passportCall("jwt")
        //console.log(user)
        
        try {
            
            const products = await this.service.getProducts()
            const productToDelete = products.find(el => el._id == pid)
            //?????
            if(productToDelete.owner != "premium@mail.com"){
                return res.status(500).json({error: "No puedes eliminar este producto"}).req.logger.error("No puedes eliminar este producto")
            }else if(productToDelete.owner == undefined || "premium@mail.com" || "adminCoder@coder.com"){
                const name = productToDelete.tittle
               await this.service.deleteProduct(pid)
            
               return res.json({OK: `Se ha eliminado el producto (${name})`}).req.logger.info(`Se ha eliminado el producto (${name})`)
            }
        }catch (e) {
            return res.status(404).json({message: "No existe el producto a eliminar"}).req.logger.warning("No existe el producto a eliminar")
        }   
    }
}

module.exports = ProductsController