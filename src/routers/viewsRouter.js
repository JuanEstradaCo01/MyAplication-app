const express = require("express")

const { Router } = express

const viewsRouter = new Router()

const products = require("../managerDB.json")



viewsRouter.get("/products", (req, res) => {

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

module.exports = viewsRouter