const { configFactory, i18nFactory, mappingsFactory } = require('./factories')
const openWeatherClient = require('./openWeatherClient')

const {
    LANGUAGE_MAPPINGS
} = require('./constants')

module.exports = async () => {
    configFactory.init()
    const config = configFactory.get()
    const language = LANGUAGE_MAPPINGS[config.locale]
    await i18nFactory.init(language)
    mappingsFactory.init(language)
    openWeatherClient.init()
}