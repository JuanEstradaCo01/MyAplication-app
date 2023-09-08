const jwt = require("jsonwebtoken")

const Private_key = "jwtsecret"

const generateToken = (payload) => {
    const token = jwt.sign({user: payload}, Private_key, {expiresIn: "24h"})

    return token
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, Private_key, (err, payload) => {
            if (err) {
                return reject(err)
            }
            return resolve(payload)
        })})
}

module.exports = {generateToken, verifyToken}