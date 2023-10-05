const express = require("express")
const { Router } = express
const viewsRouter = new Router()
const products = require("../managerDB.json")
const { generateToken,verifyToken } = require("../utils/jwt")
const BaseRouter = require("./BaseRouter")


const sessionMidleware = (req, res, next) => {
    if (req.session.usuario) {
        return res.redirect("/profile")
    }

    return next()
}

const authMidleware = async (req, res, next) => {
    const token = req.user.access_token//.replace("Bearer ", "")

    if(!token) {
        return res.status(401).json({error: "Token invalido"})
    }
    const payload = await verifyToken(token)
    req.user = payload.user

    return next()
}

class ViewsRouter extends BaseRouter {
    init () {
        this.get("/prod", (req, res) => {

            const params = {
                titulo: "Productos",
                products
            }
            return res.render("home", params)
        })
        
        this.get("/realtimeproducts", (req, res) => {
        
            const params = {
                titulo: "Productos",
                products
            }
            return res.render("realTimeProducts", params)
        })
        
        this.get("/register", sessionMidleware, async (req, res) => {
            const error = req.flash("error")[0]
            return res.render("register", {
                error,
                hasError: error !== undefined
            })
        })
        
        this.get("/login", sessionMidleware, (req, res) => {
            const error = req.flash("error")[0]
            return res.render("login", {
                error,
                hasError: error !== undefined
            })
        })
        
        this.get("/recovery", sessionMidleware, (req, res) => {
            return res.render("recovery")
        })
        
        //Vista de admin
        this.get("/products",//authMidleware , 
        async (req, res) => {
            const user = req.user
            console.log({user})
        
            const first_name = req.user.first_name
            const last_name = req.user.last_name
            const email = req.user.email
            const age = req.user.age
            const rol = "Admin"
            const provider = "Local"
             return res.render("products", {user, first_name, last_name, email, age, rol, provider})
        })
        
        this.get("/profile", //authMidleware,
         (req, res) => {
            const user = req.user
            const token = generateToken(user)
            user.access_token = token
            
            const first_name = req.user.first_name
            const last_name = req.user.last_name
            const email = req.user.email
            const age = req.user.age
            const rol = "User"
            const provider = "Local"
        
            //return res.json(user)
            return res.render("profile", {user, first_name, last_name, email, age, rol, provider})
        })
        
        this.get("/recoverysuccess", (req, res) => {
            return res.render("recoverysuccess")
        })
        
        this.get("/logout",  (req, res) => {
            return res.redirect("login")
        })
        
        this.get("/faillogin", (req, res) => {
            return res.json({error: "failLogin"})
        })

        this.get("/current", (req, res) => {
            return res.redirect("/api/sessions/current")
        })
        
        this.get("/actualizar", (req, res) => {
            return res.render("actualizar")
        })
        
        this.get("/cart", (req, res) => {
            return res.render("cart")
        })
}}

module.exports = ViewsRouter