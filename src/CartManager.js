const fs = require("fs")

class CartManager {

    constructor (path) {
        this.products = []
        this.path = path
    }

    addCart(info) {

      const newCart = {
        id: info.id,
        products: []
    }

    return this.getCarts()
      .then((prod) => {
        //Autoincrementacion del id:
        newCart.id = prod.length + 1

        prod.push(newCart)
            
        return fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2))
      })
      .catch((e) => {
        console.log("Ocurrio un error")
        return e
      })
       
    }

    getCartById (ID) {
        return this.getCarts()
          .then((prod) => {
            const prods = prod.find(prods => prods.id === ID)

            return prods
          })
          .catch((e) => {
            console.log("Ocurrio un error")
            return e
          })

    }

    getCarts() {
        return fs.promises.readFile(this.path, "utf-8")
          .then((productsString) => {
            const produ = JSON.parse(productsString)
            return produ
          })
          .catch((e) => {
              console.log("Ocurio un error")
              return []
          })
    }

    addProductToCart(data) {
      const newProduct = {
        product: data.product,
        quantity: data.quantity
      }

      return this.getCarts()
      .then((prod) => { 

      prod.push(newProduct)
            
        return fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2))
      })
      .catch((e) => {
        console.log("Ocurrio un error al agregar el producto al carrito")
        return e
      })
    }
    }


const  carrito = new CartManager("./carrito.json")


module.exports = CartManager

