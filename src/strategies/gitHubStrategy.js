const GitHubStrategy = require("passport-github2")
const userModel = require("../dao/models/userModel")
const cartsModels = require("../dao/models/cartsModels")
const { generateToken } = require("../utils/jwt")

const gitHubStrategy = new GitHubStrategy({
    clientID: "Iv1.45aff0769d29e7de",
    clientSecret: "8322bbd99aab84ce08f9e92bc88e1086fa7ebba9",
    callbackURL: `${process.env.URL_RAILWAY}/api/sessions/github-callback`
}, async (accessToken, refreshToken, profile, done) => {

    try{
        let user = await userModel.findOne({first_name: profile._json.login})


        if(user) {
            console.log("El usuario ya existe en la base de datos")
            return done(null, user)
        }

        const newUser = await userModel.create({
            first_name: profile._json.login,
            last_name: "lopez",//profile.username,
            email: "fulano@mail.com",//profile._json.email,
            age: 27, //profile._json.name,
            typeCount: "User",
            password: " ",
            provider: "GitHub",//profile.provider,
            date: new Date().toLocaleString(),
            expiratedLink: ""
        })

        return done(null, newUser)
    }catch(e){
        return done(e)
    }
})

module.exports = gitHubStrategy