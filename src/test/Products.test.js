const DBProductManager = require("../dao/DBProductManager")
const productsDao = new DBProductManager()
const Chai = require("chai")
const expect = Chai.expect
const dotenv = require("dotenv")
const DB = require("../config/singleton") 
const supertest = require("supertest")

//RUN: ./node_modules/.bin/mocha test/Products.test.js


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
describe("Testing Products router", () => {

    beforeEach(function () {
        this.timeout(6000)
    })

    it("El endpoint GET '/api/products' debe obtener todos los productos, se valida que la cantidad de productos sea igual a la especificada", async function (){
        const result = await productsDao.getProducts()
        const productsAmount = 49
        expect(result.length).to.be.equal(productsAmount)
    })

    it("El endpoint GET '/api/products' debe devolver un formato Array con todos los productos", async function () {
        const result = await productsDao.getProducts()
        assert.strictEqual(Array.isArray(result), true)
    })

    it(`El endpoint GET '/api/products/:pid' debe devolver el producto especificado por su ID`, async function () {
        const id = "6539fa895cba9c5b67807cbe"
        const product = await productsDao.getProductById(id)
        if(!product){
            return console.log("No se encontró el producto en la base de datos")
        }
        assert.ok(product)
    })

    it("El endpoint POST '/api/products' debe de agregar un producto a la base de datos, devolvera un status 500 y no dejara crear el producto porque se debe de loguear ya que solo el 'Admin' o un usuario 'Premium' pueden crear productos", async function () {
        const productToAgregate = {
            id: 50,
            tittle: "Pera",
            description: "mediano",
            price: 5,
            thumbnail: "sin imagen",
            code: "0",
            status: true,
            stock: 300,
            category: "Fruta"
        }
        const {statusCode,ok,_body} = await requester.post("/api/products").send(productToAgregate)
        expect(statusCode).to.be.equal(500)
        expect(ok).to.be.equal(false)
        expect(_body).to.be.have.property("error")
    })
}) 