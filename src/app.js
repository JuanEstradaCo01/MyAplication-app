const express = require("express")

const ProductManager = require("./ProductManager")


const managerDB = new ProductManager("./managerDB.json")

const app = express()
    

app.get("/products", async(req, res) => {

    try {
        const productos = await managerDB.getProducts()
        
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


app.get("/products/:pid", async(req, res) => {

    const Id = parseInt(req.params.pid)

    const usuarioBuscar = await managerDB.getProductById(Id)
  
    if (!usuarioBuscar) {
        return res.send({})
    }else {
        return res.send(usuarioBuscar)
    }
})

app.listen(8080, () => {
    console.log("Servidor espress 8080 escuchando")
})


