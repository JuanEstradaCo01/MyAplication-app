const winston = require("winston")
const dotenv = require("dotenv")
const {Command} = require("commander")
const program = new Command()
program 
  .option('--mode <mode>', 'Modo de trabajo', 'dev',
          '--mode <mode>', 'Modo de trabajo', 'prod')
program.parse()
const options = program.opts()
dotenv.config({
  path: `./.env.${options.mode}`
})
const mod = options.mode

const levelsSystem = {
    levels: {
        debug: 5,
        http: 4 ,
        info: 3,
        warning: 2,
        error: 1,
        fatal: 0,
    },
    colors: {
        debug: "green",
        http: "blue",
        info: "green",
        warning: "yellow",
        error: "red",
        fatal: "grey",
    }
}

if(mod === "dev") {
    const logger = winston.createLogger({
        levels: levelsSystem.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: levelsSystem.colors}),
                    winston.format.simple()
                )
            })
        ], level:"debug"
    })

    const addLogger = (req, res, next) => {
        req.logger =  logger
        req.logger.http(`${req.method} en "${req.url}" a las ${new Date().toLocaleTimeString()}`)
        next() 
    }
    
    module.exports =  addLogger
}

if(mod === "prod") {
    const logger = winston.createLogger({
        levels: levelsSystem.levels,
        transports: [
            new winston.transports.Console({
                level: "debug",
                format: winston.format.combine(
                    winston.format.colorize({colors: levelsSystem.colors}),
                    winston.format.simple()
                )
            })
            /*new winston.transports.File({
                filename: "./errors.log",
                level: "error",
                format: winston.format.simple()
            })*/
        ], level:"debug"
    })

    const addLogger = (req, res, next) => {
        req.logger = logger
        req.logger.http(`${req.method} en ${req.url} a las ${new Date().toLocaleTimeString()}`)
        next() 
    }
    
    module.exports =  addLogger
}
