const DBProductManager = require("../dao/DBProductManager")
const productsDao = new DBProductManager()
const DBUserManager = require("../dao/DBUserManager")
const userDao = new DBUserManager()
const DBCartManager = require("../dao/DBCartManager")
const cartDao = new DBCartManager()
const Chai = require("chai")
const expect = Chai.expect
const dotenv = require("dotenv")
const DB = require("../config/singleton") 
const supertest = require("supertest")

//RUN: ./node_modules/.bin/mocha test/Carts.test.js


//Configuro para que tome las variables de entorno en el modo Desarrollo
dotenv.config({
    path: "./.env.dev"
})
const configFn = require("../config")
const config = configFn()
//Conexion a la base de datos(MongoDB) --> patrón singleton:
const singletonConnection = DB.getConnection(config)

const Assert = require("assert")
const assert = Assert.strict
const requester = supertest(`http://localhost:${process.env.PORT}`)

describe("Testing Carts CRUD", () => {
    beforeEach(function () {
        this.timeout(6000)
    })

    it("El endpoint GET '/api/carts' debe de traer los carritos satisfactoriamente y se verifica que sea como Array", async function () {
        const carts = await cartDao.getCarts()
        expect(carts).to.be.ok
        assert.strictEqual(Array.isArray(carts), true)
    })

    it("El endpoint GET '/api/carts/:cid' traerá un carrito por su ID  satisfactoriamente y se verifica que la propiedad 'products' sea un Array la cual contiene los productos del carrito", async function () {
        //Se toma el ultimo cart(cart para test) de la base de datos para hacer el test dinamico:
        const carts = await cartDao.getCarts()
        const lastCart = carts.at(-1)
        const cid = lastCart._id

        const cart = await cartDao.getCartById(cid)
        const productsOfCart = cart.products
        expect(cart).to.be.ok
        assert.strictEqual(Array.isArray(productsOfCart), true)
    })

    it("El endpoint POST '/api/carts' debe crear un carrito nuevo  satisfactoriamente", async function () {
        const cart = {
            name: "Carrito de fulano",
            products: []
        }
        const newCart = await cartDao.addCart(cart)
        expect(newCart).to.be.ok
    })

    it("El endpoint PUT '/api/carts/:cid' modifica el carrito especificado satisfactoriamente", async function () {
        //Se toma el ultimo cart de la base de datos para hacer el test dinamico:
        const carts = await cartDao.getCarts()
        const lastCart = carts.at(-1)
        const cid = lastCart._id

        const body = {
            name: "Carrito modificado TEST",
            products: []
        }

        const update = await cartDao.updateCart(cid,body)
        expect(update).to.be.ok
    })

    it("El endpoint DELETE '/api/carts/:cid' elimina un carrito  satisfactoriamente", async function () {
        //Se toma el ultimo cart de la base de datos para hacer el test dinamico:
        const carts = await cartDao.getCarts()
        const lastCart = carts.at(-1)
        const cid = lastCart._id

        const cartToDelete = await cartDao.deleteCart(cid)
        expect(cartToDelete).to.be.ok
    })
})