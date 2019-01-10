const {
    translation,
    logger
} = require('../utils')
const commonHandler = require('./common')

module.exports = async function (msg, flow) {
    const {
        place,
        formattedForecastData
    } = await commonHandler(msg, { mergeFormattedData: false })

    const speech = translation.temperatureToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}