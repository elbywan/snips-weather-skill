const {
    translation, logger
} = require('../utils')
const commonHandler = require('./common')

module.exports = async function (msg, flow) {
    const {
        place,
        formattedForecastData,
        intervalsAreTruncated
    } = await commonHandler(msg, { mergeFormattedData: true })

    const speech =
        translation.warnAboutTruncatedIntervals(intervalsAreTruncated) +
        ' ' +
        translation.forecastToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}