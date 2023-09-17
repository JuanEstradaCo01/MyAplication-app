const {Router} = require("express")

class BaseRouter {
    constructor() {
        this.router = Router()
        this.init()
    }

    init () {}

    getRouter() {
        return this.router
    }

    get(path, ...callbacks) {
        this.router.get(path, this.generateCustomResponses(), this.applyCallbacks(callbacks))
    }

    post(path, ...callbacks) {
        this.router.post(path, this.applyCallbacks(callbacks))
    }

    put(path, ...callbacks) {
        this.router.put(path, this.applyCallbacks(callbacks))
    }

    delete(path, ...callbacks) {
        this.router.delete(path, this.applyCallbacks(callbacks))
    }

    applyCallbacks(callbacks) {
        return callbacks.map(call => (...params) => {
            call.apply(this, params)
        })        
    }

    generateCustomResponses () { return (req, res, next) =>  {
        res.sendSuccess = payload => res.json({status: "success", payload})
        res.sendServerError = error => res.status(500).json({status: "error",error})
        res.sendUserError = error => res.status(400).json({error})
        return next()
    }}
}

module.exports = BaseRouter