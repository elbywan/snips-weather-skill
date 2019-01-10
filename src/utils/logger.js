const debug = require('debug')
const infoLogger = debug('weather:info')
const debugLogger = debug('weather:debug')
const errorLogger = debug('weather:error')

module.exports = {
    info: (...args) => infoLogger(...args),
    debug: (...args) => debugLogger(...args),
    error: (...args) => errorLogger(...args)
}