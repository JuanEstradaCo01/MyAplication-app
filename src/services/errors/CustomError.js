class CustomError {
    static generateError({name= "Error", cause, message, code = 1}) {
        const error = new Error(message, {cause})
        error.name = name
        error.code = code
        return error
    }
}

module.exports = CustomError