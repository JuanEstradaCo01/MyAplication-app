const express = require("express")
const ProductManager = require("../dao/FS/FSProductManager")
const uploader = require("../utils")
const init = require("../utils/io")
//const managerDB = new ProductManager("./managerDB.json") //Para usar FS
const { Router } = express
const productRouter = Router()
const DBProductManager = require("../dao/DBProductManager")
const BaseRouter = require("./BaseRouter")
const dbproductManager = new DBProductManager() //Para usar mongo

//NOTA: Descomentar todo lo que este comentado si se quiere usar FS

class ProductRouter extends BaseRouter {
    init () {
        this.get("/", async (req, res, ) =>  {

            try {
                const productos = await dbproductManager.getProducts()
                
                const limite = parseInt(req.query.limit)
        
                if ( isNaN(limite)) {
                    res.json(productos)
                }else {
                    res.json(productos.slice(0, limite))
                }
        
            }catch (err){
                console.log("No existen productos", err)
            }
        })
        
        this.get("/:pid", async(req, res) => {
        
            const pid = req.params.pid //convertirlo con parseInt cuando se quiera usar FS
        
            const productBuscar = await dbproductManager.getProductById(pid)
          
            if (!productBuscar) {
                return res.send({error: "El producto no existe"})
            }else {
                return res.json(productBuscar)
            }
        })
        
        this.post("/", async(req, res) => {
            /*const data = req.body
            const guardar = await managerDB.getProducts()
        
            data.id = guardar.length + 1*/
            const data = req.body
        
            const guardar = await dbproductManager.getProducts()
        
            data.code = guardar.length + 1 //Autoincremento el code ya que debe ser unico
        
            await dbproductManager.addProduct(data) 
         
            return res.status(201).json(data)
        })   
        
        this.put("/:pid", async(req, res) => {
            /*const data = req.body
        
            const pid = parseInt(req.params.pid)
        
            const guardar = await managerDB.getProducts()
        
            const product = guardar.find( item => item.id === pid)
        
            if (!product) {
                return res.status(404).json({
                    error: "Producto no encontrado"
                })
            }
        
            //Campos a modificar
        
            product.tittle = data.tittle || product.tittle
            product.description = data.description || product.description
            product.price = data.price || product.price
            product.thumbnail = product.thumbnail
            product.stock = data.stock || product.stock
        
            const modificar = await managerDB.updateProduct(pid, product)
        */
        
            const body = req.body
        
            const pid = req.params.pid
        
            await dbproductManager.updateProduct(pid, body)
            return res.status(200).json(body)
        })
        
        this.delete("/:pid", async(req, res) => {
        
            /*const pid = parseInt(req.params.pid)
        
            const guardar = await managerDB.getProducts()
        
            const productIndex = guardar.find( item => item.id === pid)
            const indice = guardar.indexOf(productIndex)
        
            if (productIndex === undefined) {
                return res.status(404).json({
                    error: "!Producto no encontrado!"
                })
            }
        
            guardar.splice(indice, 1)
        
            const nombre = productIndex.tittle
        
            return res.json({
                ok:`(${nombre}) ha sido eliminado`,
                
            })*/
        
            const pid = req.params.pid
        
            try {
        
                const products = await dbproductManager.getProducts()
                const productToDelete = products.find(el => el._id == pid)
                const name = productToDelete.tittle
                await dbproductManager.deleteProduct(pid)
        
                return res.json({OK: `Se ha eliminado el producto (${name})`})
            }catch (e) {
                return res.status(404).json({mensaje: "No existe el producto a eliminar"})
            }
        })
    }
}

module.exports = ProductRouter

