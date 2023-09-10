const GitHubStrategy = require("passport-github2")
const userModel = require("../dao/models/userModel")
const { generateToken } = require("../utils/jwt")

const gitHubStrategy = new GitHubStrategy({
    clientID: "Iv1.45aff0769d29e7de",
    clientSecret: "8322bbd99aab84ce08f9e92bc88e1086fa7ebba9",
    callbackURL: "http://localhost:8080/api/sessions/github-callback"
}, async (accessToken, refreshToken, profile, done) => {
    console.log({profile})

    try{
        let user = await userModel.findOne({username: profile._json.login})

        if(user) {
            console.log("El usuario ya existe")
            return done(null, user)
        }

        const newUser = await userModel.create({
            username: profile._json.login,
            lastname: profile.username,
            email: "fulano@mail.com",//profile._json.email,
            age: 27, //profile._json.name,
            password: " ",
            rol: profile._json.type,
            provider: profile.provider,
            acces_token: ""
        })


        return done(null, newUser)
    }catch(e){
        return done(e)
    }
})

module.exports = gitHubStrategy