const ProductsService = require("../services/productsService")

class ProductsController {
    constructor() {
        this.service = new ProductsService()
    }

    async getProducts(req, res) {

        try {
            const productos = await this.service.getProducts()
            
            const limite = parseInt(req.query.limit)
    
            if ( isNaN(limite)) {
                res.json(productos)
            }else {
                res.json(productos.slice(0, limite))
            }
    
        }catch (err){
            console.log("No existen productos", err)
        }

    }

    async getProductById(req, res) {

        try{
            const pid = req.params.pid
        
            const productBuscar = await this.service.getProductById(pid)
            return res.json(productBuscar)

        }catch{
            return res.status(404).json({error: "El producto no existe"})
        }

    }

    async addProduct(req, res) {

        const data = req.body
        
        const guardar = await this.service.getProducts()
        
        data.code = guardar.length + 1 
        data.id = guardar.length + 1 
        
        const newProduct = await this.service.addProduct(data)

       if(!newProduct) {
         return res.status(500).json({error: "No se pudo crear el producto"})
        }

        return res.json(data)
    }

    async updateProduct(req, res) {

        const body = req.body
        
        const pid = req.params.pid

        const guardar = await this.service.getProducts()
        
        body.code = guardar.length
        
        const update = await this.service.updateProduct(pid, body)

        if(!update) {
            return res.status(500).json({error: "No se pudo actualizar el producto"})
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
            
            return res.json({OK: `Se ha eliminado el producto (${name})`})
        }catch (e) {
            return res.status(404).json({mensaje: "No existe el producto a eliminar"})
        }   
    }
}

module.exports = ProductsController