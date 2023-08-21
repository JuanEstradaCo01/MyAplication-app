const express = require("express")

const { Router } = express

const viewsRouter = new Router()

const products = require("../managerDB.json")



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

viewsRouter.get("/register", (req, res) => {
    return res.render("register")
})

viewsRouter.get("/login", (req, res) => {
    return res.render("login")
})

module.exports = viewsRouter