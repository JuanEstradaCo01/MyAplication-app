const Chai = require("chai")
const expect = Chai.expect
const supertest = require("supertest")
const Assert = require("assert")
const assert = Assert.strict
const dotenv = require("dotenv")

//RUN: ./node_modules/.bin/mocha test/Sessions.test.js


//Configuro para que tome las variables de entorno en el modo Desarrollo
dotenv.config({
    path: "./.env.dev"
})
const configFn = require("../config")
const config = configFn()
const requester = supertest(`http://localhost:${process.env.PORT}`)

describe("Testing session", function () {
    const user = {
        first_name: "Testing",
        last_name: "Lopez",
        email: "testing@mail.com",
        password: "Guillermo00",
        age: 45,
        typeCount: "User"
    }

    it("En el endpoint POST '/api/sessions/register' se debe registrar correctamente un usuario", async function () {
        const newUser = await requester.post("/api/sessions/register").send(user)
        expect(newUser).to.be.ok
    })

    it("En el endpoint POST '/api/sessions/login' se debe hacer login con un usuario registrado", async function () {
       const login = await requester.post("/api/sessions/login").send({
        email: user.email,
        password: user.password
       })

       //Traigo la cookie que almacena el JWT:
       const cookie = login.headers["set-cookie"][0]  

       //Uso el metodo split para separar llave-valor a partir del '=' y uso replace para dejar el valor del JWT puro:
       const cookieToken = {
        name: cookie.split("=")[0],
        Token: cookie.split("=")[1].replace("; Max-Age", "")
       }  
       expect(cookieToken.name).to.be.equal("Token")
       expect(cookieToken.Token).to.be.ok
    })

    it("En el endpoint POST '/api/sessions/logout' se debe cerrar sesion", async function () {
        const logout = await requester.post("/api/sessions/logout")
        expect(logout).to.be.ok
    })
})