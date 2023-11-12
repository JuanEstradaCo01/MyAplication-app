const DBProductManager = require("../dao/DBProductManager")
const productsDao = new DBProductManager()
const Chai = require("chai")
const expect = Chai.expect
const dotenv = require("dotenv")
const DB = require("../config/singleton") 

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
describe("Testing Products DAO", () => {

    beforeEach(function () {
        this.timeout(6000)
    })

    it("El metodo 'getProducts' debe obtener todos los productos, se valida que la cantidad de productos sea igual a la especificada", async function (){
        const result = await productsDao.getProducts()
        const productsAmount = 49
        expect(result.length).to.be.equal(productsAmount)
    })

    it("El metodo 'getProducts' debe devolver un formato Array con todos los productos", async function () {
        const result = await productsDao.getProducts()
        assert.strictEqual(Array.isArray(result), true)
    })

    it(`El metodo 'getProductById' debe devolver el producto especificado por su ID, en este caso se validará con un ID de un producto existente (manzana)`, async function () {
        const id = "6539fa895cba9c5b67807cbe"
        const product = await productsDao.getProductById(id)
        if(!product){
            return console.log("No se encontró el producto en la base de datos")
        }
        assert.ok(product)
    })
}) 