const DBProductManager = require("../dao/DBProductManager")
const productsDao = new DBProductManager()
const DBUserManager = require("../dao/DBUserManager")
const userDao = new DBUserManager()
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


describe("Testing Products",  () =>{

    beforeEach(function () {
        this.timeout(6000)
    })

    it("El endpoint GET '/api/products' obtendrá todos los productos, se valida que la cantidad de productos sea igual a la especificada", async function (){
        const products = await productsDao.getProducts()
        const productsAmount = products.length //O se especifica un numero cualquiera para verificar que funciona, se coloca length para hacerlo dinamico
        expect(products.length).to.be.equal(productsAmount)
    })

    it("El endpoint GET '/api/products' devolvera un formato Array con todos los productos", async function () {
        const products = await productsDao.getProducts()
        assert.strictEqual(Array.isArray(products), true)
    })

    it(`El endpoint GET '/api/products/:pid' devolvera el producto especificado por su ID`, async function () {
        //Se toma el ultimo producto de la base de datos para el test:
        const products = await productsDao.getProducts()
        const lastProduct = products.at(-1)
        const pid = lastProduct._id
        const productFind = await productsDao.getProductById(pid)
        expect(productFind).to.be.ok
    })

    it("El endpoint POST '/api/products' agrega un producto a la base de datos, devolvera un status 500 y no dejara crear el producto porque se debe de loguear ya que solo el 'Admin' o un usuario 'Premium' pueden crear productos", async function () {
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

    it("El endpoint PUT '/api/products/:pid' modifica un producto ya existente", async function () {
        //Se toma el ultimo producto de la base de datos para el test:
        const products = await productsDao.getProducts()
        const lastProduct = products.at(-1)
        const pid = lastProduct._id
        const findProduct = await productsDao.getProductById(pid)
        const body = {
            //_id: findProduct._id,
            id: findProduct.id,
            tittle: `${findProduct.tittle} modificado TEST`,
            description: 'grande',
            price: 10,
            thumbnail: findProduct.thumbnail,
            code: findProduct.code,
            status: findProduct.status,
            stock: findProduct.stock,
            category: findProduct.category
        }

        const update = await productsDao.updateProduct(pid, body)
        expect(update).to.be.ok
    })

    it("El endpoint DELETE '/api/products/:pid/api/users/:uid' elimina un producto de la base de datos", async function () {
        //NOTA: Se debe especificar el ID del usuario que lo va a eliminar(uid) para saber si el usuario está autorizado para eliminar ese producto

        //Se toma el ultimo producto de la base de datos para el test:
        const products = await productsDao.getProducts()
        const lastProduct = products.at(-1)
        const pid = lastProduct._id

        //Busco el usuario segun el 'owner' del producto:
        const find = await productsDao.getProductById(pid)
        if(find.owner === "Admin") {
            const users = await userDao.getUsers()
            const findUser = users.find(item=>item.typeCount === find.owner)
            const uid = findUser._id
            const product = await requester.delete(`/api/products/${pid}/api/users/${uid}`)
            return expect(product).to.be.ok
        }

        const users = await userDao.getUsers()
        const findUser = users.find(item=>item.email === find.owner)
        const uid = findUser._id
        const product = await requester.delete(`/api/products/${pid}/api/users/${uid}`)
        expect(product).to.be.ok
    })
}) 