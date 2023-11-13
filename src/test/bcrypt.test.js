const Assert = require("assert")
const {createHash, isValidPassword} = require("../utils/passwordHash")

//RUN: ./node_modules/.bin/mocha test/bcrypt.test.js

describe("Testing de Hasheo con bcrypt", function () {
    it("El test debe verificar que la funcion 'createHash' funciona correctamente, devolviendo la contraseña hasheada y se verifica que la contraseña sin hashear no sea igual a la hasheada", function () {
        const password = "Perro05"
        const passwordHashed = createHash(password)
        Assert.notEqual(password, passwordHashed)
    })

    it("El test debe verificar si la funcion 'isValidPassword' funciona correctamente, la cual compara si una contraseña 'X' es igual a esa misma contraseña ya hasheada", function () {
        const password = "Prueba01"
        const passwordHashed = createHash(password)

        //Password hasheada de prueba para verificar que no funciona si es diferente (password2 o passwordHashed2):
        const password2 = "Ensayo01"
        const passwordHashed2 = createHash(password2)

        const validatePasswordHashed = isValidPassword(password, passwordHashed)

        Assert.ok(validatePasswordHashed)
    })
})