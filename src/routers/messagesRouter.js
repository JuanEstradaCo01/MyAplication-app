const express = require("express")
const { Router } = express
const messageRouter = Router()

const DBMessagesManager = require("../dao/DBMessagesManager")
const dbmessagesmanager = new DBMessagesManager()

messageRouter.get("/"), async(req, res) => {
    try{
        const mensajes = await dbmessagesmanager.getMessages()

        return res.json(mensajes)
    }catch (e) {
        console.log("No existen mensajes", e)
    }
}

module.exports = messageRouter