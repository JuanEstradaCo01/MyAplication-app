const ProductsService = require("../services/productsService")
const ProductDto = require("../dao/DTOs/productDto")
const productRepository = require("../services/index")
const DBCartManager = require("../dao/DBCartManager")
const cartmanager = new DBCartManager()
const UserManager = require("../dao/DBUserManager")
const usermanager = new UserManager()
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

            const name = productBuscar.tittle
            const size = productBuscar.description
            const price = productBuscar.price
            const image = productBuscar.thumbnail
            const code = productBuscar.code
            let status = productBuscar.status
            let stock = productBuscar.stock
            const category = productBuscar.category
            const owner = productBuscar.owner

            //Valido si hay stock suficiente del producto:
            if(stock <= 0){
                status = false
                return res.render("productDetail", {name,owner,size,price,image,code,status,stock,category})
            }
            return res.render("productDetail", {name,owner,size,price,image,code,status,stock,category})

        }catch(e){
            return res.status(404).json({error: "El producto no existe en la base de datos"}).req.logger.error("El producto no existe en la base de datos")
        }
    }

    async addProduct(req, res, next){
        const file = req.file
        console.log({file})
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

        req.logger.info("Se actualizó correctamente el producto")

        return res.json(update)
    }

    async deleteProduct(req, res) {

        //NOTA: para eliminar productos se debe especificar el id del producto y el id del usuario validando si esta autorizado para eliminar (/api/products/:pid/api/users/:uid)

        const pid = req.params.pid  
        const uid = req.params.uid
    
        try {
            const user = await usermanager.getUserById(uid)
            
            if(!user){
                return res.status(404).json({error: "No existe el usuario en la base de datos"}).req.logger.error("No existe el usuario en la base de datos")
            }
            
            const productToDelete = await this.service.getProductById(pid)

            if(!productToDelete){
                return res.status(404).json({error: "No existe el producto a eliminar"}).req.logger.error("No existe el producto a eliminar")
            }

            const userRol = user.typeCount
            const validar = userRol === "Premium"
            
            if(validar){
                const validate = productToDelete.owner === user.email
            
                if(!validate){
                    return res.status(500).json({error: "No estas autorizado para eliminar este producto"}).req.logger.error("No estas autorizado para eliminar este producto")
                }

                const name = productToDelete.tittle
                await this.service.deleteProduct(pid)
            
                return res.json({OK: `Se ha eliminado el producto (${name})`}).req.logger.info(`Se ha eliminado el producto (${name})`)
            }
    
            const name = productToDelete.tittle
            await this.service.deleteProduct(pid)
            
            return res.json({OK: `Se ha eliminado el producto (${name})`}).req.logger.info(`Se ha eliminado el producto (${name})`)

        }catch (e) {
            return res.status(500).json({message: "Ha ocurrido un error"}).req.logger.warning("Ha ocurrido un error")
        }   
    }

    async updateProductImage(req, res) {
        const pid = req.params.pid
        const file = req.file
        try{
            const product = await this.service.getProductById(pid)

            if(!product){
                req.logger.error("El producto no existe")
                return res.status(404).json({Error: "El producto no existe"})
            }

            const productImage = {
                thumbnail: file.path
            }

            await this.service.updateProductImage(product._id, productImage)

            req.logger.info(`Se ha modificado la imagen de ${product.tittle} correctamente`)

            return res.status(200).json({ok: `Se ha modificado la imagen de ${product.tittle} correctamente`})
        }catch(e){
            req.logger.fatal("Ha ocurrido un error al modificar la imagen del producto")
            return res.status(500).josn({error: "Ha ocurrido un error al modificar la imagen del producto"})
        }
    }
}

module.exports = ProductsController