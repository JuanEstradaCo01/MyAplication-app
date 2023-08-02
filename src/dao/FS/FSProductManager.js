const fs = require("fs")

class ProductManager {

    constructor (path) {
        this.products = []
        this.path = path
    }

    addProduct(info) {

        //Validacion: para que todos los campos sean requeridos:
        if ( !info.tittle) {
            const error = "Error: Todos los campos son requeridos"
            console.log(error)
            return error
        }

        //Validacion del CODE:
        const existe = this.products.findIndex((product) => product.code === info.code)

        if ( existe !== -1 ) {
            console.log("Error: el CODE ya existe")
            return existe
        }

        //Validacion del stock:
        if ( info.stock == 0 ){
            const agotado = `(${info.tittle}) Producto AGOTADO`
            console.log(agotado)
        }else {
            console.log(`(${info.tittle}) Producto agregado exitosamente!`)
        }

        const newProduct = {
            id: info.id,
            tittle: info.tittle,
            description: info.description,
            price: info.price,
            thumbnail: info.thumbnail , //(ruta de imagen)
            code: info.code,
            status: info.status,
            stock: info.stock,
            category: info.category
        }

        return this.getProducts()
          .then((prod) => {
            //Autoincrementacion del id:
            newProduct.id = prod.length + 1

            //Autoincrementacion del code para que no se repita:
            const co = prod.length + 1
            newProduct.code = `abc000${co}` 
            prod.push(newProduct)
                
            return fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2))
          })
          .catch((e) => {
            console.log("Ocurrio un error")
            return e
          })

    }

    getProductById (id) {
        return this.getProducts()
          .then((prod) => {
            const prods = prod.find(prods => prods.id === id)

            return prods
          })
          .catch((e) => {
            console.log("Ocurrio un error al obtener el producto")
            return e
          })

    }

    getProducts() {
        return fs.promises.readFile(this.path, "utf-8")
          .then((productsString) => {
            const produ = JSON.parse(productsString)
            return produ
          })
          .catch((e) => {
              console.log("Ocurio un error al mostrar los productos")
              return []
          })
    }

    updateProduct(Id, info) {
        return this.getProducts()
          .then((prod) => {
            const productoIndex = prod.findIndex(prods => prods.id === Id)

            if (productoIndex === -1){
                return
            }

            prod[productoIndex].tittle = info.tittle
            prod[productoIndex].description = info.description
            prod[productoIndex].price = info.price
            prod[productoIndex].thumbnail = info.thumbnail //Ruta de imagen
            prod[productoIndex].stock = info.stock

            console.log("Se actualizo el producto")

            return fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2))
          })
          .catch((e) => {
            console.log("Error al actualizar el producto")
            return e
          })
    }

    deleteProduct(id) {  
      return this.getProducts()
      .then((producto) => {
        const productIndex = producto.findIndex((i) => i.id === id)

      if (productIndex === -1) {
        return console.log("Producto no encontrado")
      }
      producto.splice(productIndex, 1) 
    
      console.log("Producto eliminado")
      })
      
    }


    }


const  managerDB = new ProductManager("./managerDB.json")



//Agregando productos al archivo:
/*managerDB.addProduct({
    id: 0, //Autoincrementable
    tittle: "Producto",
    description: "Caracteristicas",
    price: 250,
    thumbnail: "Sin imagen",
    code: 10, //Autoincrementable
    stock: 30
})*/


//Buscando un producto por su ID:
/*managerDB.getProductById(10)
  .then((elemento) => {
    console.log(elemento)
    return elemento
  })
  .catch((p) => {
    console.log("No se encontro el producto en el archivo")
    return p
  })
*/

//Mostrando todos los productos que se agregan al archivo:
/*managerDB.getProducts()
  .then((e) => {
    console.log(e)
    return e
  })
  .catch((a) => {
    console.log("No hay productos en el archivo")
    return a
  })
*/

/*
//Modificando el producto creado:
productosDB.updateProduct(2, {
    id: 0, 
    tittle: "Producto actualizado",
    description: "Caracteristicas actualizadas",
    price: 250,
    thumbnail: "Sin imagen",
    code: 1000, 
    stock: 40 //Stock actualizado
})
  .then(() => {
    return managerDB.getProductById(2)
})
  .then((obj) => {
    console.log(obj)
    return obj
})
  .catch((g) => {
    console.log("Ocurrio un error al actualizar el producto")
    return g
  })*/


  //managerDB.deleteProduct(1)


module.exports = ProductManager