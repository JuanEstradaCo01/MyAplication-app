const mongoose = require("mongoose")

class MongoSingleton {
    static connection

    constructor(config) {

        const MONGODB_CONNECT_LOCAL = `mongodb+srv://${config.DB_USER}:${config.DB_PASSWORD}@${config.DB_HOST}/${config.DB_NAME}?retryWrites=true&w=majority`

        mongoose.connect(MONGODB_CONNECT_LOCAL)
          .then(() => console.log(`✔ CONECTADO A LA BASE DE DATOS(${config.DB_NAME})`))
          .catch((e) => console.log(e))
    }

    static getConnection(config){
        if(this.connection) {
            console.log("Ya existe una conexion a la base de datos")
            return this.connection
        }

        this.connection = new MongoSingleton(config)

        return this.connection
    }
}

module.exports = MongoSingleton