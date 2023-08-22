const express = require("express")

const { Router } = express

const viewsRouter = new Router()

const products = require("../managerDB.json")

const sessionMidleware = (req, res, next) => {
    if (req.session.usuario) {
        return res.redirect("/profile")
    }

    return next()
}

viewsRouter.get("/prod", (req, res) => {

    const params = {
        titulo: "Productos",
        products
    }
    return res.render("home", params)
})

viewsRouter.get("/realtimeproducts", (req, res) => {

    const params = {
        titulo: "Productos",
        products
    }
    return res.render("realTimeProducts", params)
})

viewsRouter.get("/register", sessionMidleware, (req, res) => {
    return res.render("register")
})

viewsRouter.get("/login", sessionMidleware, (req, res) => {
    return res.render("login")
})

viewsRouter.get("/profile", (req, res, next) => {
    if (!req.session.usuario) {
        return res.redirect("/login")
    }

    return next()
}, (req, res) => {
    const user = req.session.usuario

    //Valido el correo registrado para saber si es admin o no ya que el valor es unico
    if (user.email === "adminCoder@coder.com") {
        user.admin = true
    }else{
        user.admin = "Rol (usuario)"
    }
    return res.render("profile", {user})
})

viewsRouter.get("/logout",  (req, res) => {
    return res.redirect("login")
})

module.exports = viewsRouter