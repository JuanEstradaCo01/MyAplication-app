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
        console.log("Ocurrio un error al agregar el carrito")
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
            console.log("Ocurrio un error al traer el carrito por ID")
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
              console.log("Ocurio un error al traer los carrito")
              return []
          })
    }

    saveCart(prod) {     
            
        return fs.promises.writeFile(this.path, JSON.stringify(prod, null, 2))
    }
    }


const  carrito = new CartManager("./carrito.json")


module.exports = CartManager

