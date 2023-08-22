const express = require("express")
const userModel = require("../dao/models/userModel")

const sessionRouter = express.Router()

sessionRouter.get("/", ( req, res) => {
    return res.json(req.session)

    
    if (!req.session.counter) {
      req.session.counter= 1
      req.session.username = req.query.username
  
      return res.json(`Hola ${req.session.username}`)
    }else {
      req.session.counter++
  
      return res.json(`${req.session.username} has ingreado ${req.session.counter} veces`)
    }
  })


sessionRouter.post("/register", async (req, res) => {
    const user = await userModel.create(req.body)
    const usuarioCreado = user
    console.log({usuarioCreado})
    return res.redirect("/login")
    //return res.status(201).json(user)
  })

module.exports = sessionRouter

sessionRouter.post("/login", async(req, res) => {
    let user = await userModel.findOne({email: req.body.email})

    if (!user) {
        return res.status(404).json({
            error: "No existe el usuario"
        })
    }

    if (user.password !== req.body.password) {
        return res.status(404).json({
            error: "(Datos incorrectos) Usuario y/o contraseña incorrecta"
        })
    }

    //Para no mostrar la contraseña 
    user = user.toObject()
    delete user.password


    req.session.usuario = user
    return res.redirect("/profile")
})

sessionRouter.post("/logout", (req, res) => {
  req.session.destroy(e => {
    if (!e) {
    return res.redirect("/login")
    }
  
    return res.render("login")
})
})