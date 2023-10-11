const EErrors = require("../errors/enums")

const ErrorMiddleware = (error, req, res, next) => {
    console.log(error.cause)

    switch(error.code) {

        case(EErrors.INVALID_TYPES_ERROR):
            return res.send({error: error.name})
            break;

        default:
            return res.send({error: "Error inesperado"})
    }
}

module.exports = ErrorMiddleware