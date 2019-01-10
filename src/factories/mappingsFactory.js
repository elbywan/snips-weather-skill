const { DEFAULT_LANGUAGE } = require('../constants')

let mappings = null

function init (language = DEFAULT_LANGUAGE) {
    mappings = {
        city: require(`../../assets/mappings/${language}/city.json`),
        country: require(`../../assets/mappings/${language}/country.json`),
        region: require(`../../assets/mappings/${language}/region.json`)
    }
}

module.exports = {
    init,
    get () {
        return mappings
    }
}