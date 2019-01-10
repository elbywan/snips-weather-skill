const {
    translation, logger
} = require('../utils')
const commonHandler = require('./common')

module.exports = async function (msg, flow) {
    const {
        place,
        formattedForecastData
    } = await commonHandler(msg, { mergeFormattedData: true })

    const speech = translation.forecastToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}