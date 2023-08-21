const { Router } = require("express")
const DBMessagesManager = require("../dao/DBMessagesManager")
const dbmessagesmanager = new DBMessagesManager()
//import { mensajeObjeto } from "../public/js"


const viewsRouterFn = (io) => {

    const viewsRouter = new Router()

    const users = []


    viewsRouter.get("/chatLogin", (req, res) => {
        return res.render("chatLogin")
    })


    viewsRouter.post("/chatLogin", (req, res) => {
        const user = req.body

        const username = user.nombre

        users.push(username)

        //io.emit("newUser", username)

        console.log(users)

        return res.redirect(`/chat?username=${username}`)
    })


    viewsRouter.get("/chat", (req, res) => {
        return res.render("chat")
    })

    viewsRouter.post("/chat", async (req, res) => {
        const body = req.body
        console.log(body)

        await dbmessagesmanager.getMessages(body)

        return res.status(201).json(body)
    })

    return viewsRouter
}



module.exports = viewsRouterFn