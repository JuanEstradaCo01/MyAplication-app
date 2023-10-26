const DBProductManager = require("../dao/DBProductManager")

const mapper = {
    mongo: () => new DBProductManager(),
    default: () => new DBProductManager()
}

module.exports = (storage) => { 
    const storageFn = mapper[storage] || mapper.default

    const dao = storageFn()

    return dao
} 