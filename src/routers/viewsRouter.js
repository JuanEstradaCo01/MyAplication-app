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

viewsRouter.get("/recovery", sessionMidleware, (req, res) => {
    return res.render("recovery")
})

//Vista de admin
viewsRouter.get("/products" , async (req, res) => {
    return res.render("products")
})

viewsRouter.get("/profile", (req, res) => {
    return res.render("profile", user)
})

viewsRouter.get("/recoverysuccess", (req, res) => {
    return res.render("recoverysuccess")
})

viewsRouter.get("/logout",  (req, res) => {
    return res.redirect("login")
})


viewsRouter.get("/faillogin", (req, res) => {
    return res.render("failLogin")
})

module.exports = viewsRouter