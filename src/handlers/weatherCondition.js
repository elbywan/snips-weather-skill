const {
    translation,
    logger,
    message
} = require('../utils')
const { configFactory } = require('../factories')
const {
    LANGUAGE_MAPPINGS,
    CONDITIONS_MAPPINGS,
    TEMPERATURE_TRESHOLDS
} = require('../constants')
const commonHandler = require('./common')

module.exports = async function (msg, flow) {

    const config = configFactory.get()
    const language = LANGUAGE_MAPPINGS[config.locale]
    const conditionRawName = message.getSlotsByName(msg, 'condition_name', { onlyMostConfident: true })

    if(!conditionRawName) {
        throw new Error('intentNotRecognized')
    }

    const conditionName = CONDITIONS_MAPPINGS[language][conditionRawName.value.value]

    const {
        place,
        formattedForecastData
    } = await commonHandler(msg, { mergeFormattedData: true })

    let speech = ''
    if(conditionName === 'cold' || conditionName === 'warm') {
        // Temperature
        const filteredReports = formattedForecastData.filter(report => {
            const meanTemperature = (report.temperatures.min + report.temperatures.max) / 2
            const threshold = TEMPERATURE_TRESHOLDS[conditionName]
            return conditionName === 'cold' ?
                meanTemperature <= threshold :
                meanTemperature >= threshold
        })
        if(filteredReports.length === 0) {
            speech += translation.conditionToSpeech(conditionName, 'no', place)
            speech += translation.temperatureToSpeech(formattedForecastData)
        } else {
            speech += translation.conditionToSpeech(conditionName, 'yes', place)
            speech += translation.temperatureToSpeech(filteredReports)
        }
    } else {
        // Temperature
        const filteredReports = formattedForecastData.filter(report => (
            report.report.type === conditionName
        ))
        if(filteredReports.length === 0) {
            speech += translation.conditionToSpeech(conditionName, 'no', place)
            speech += translation.forecastToSpeech(formattedForecastData)
        } else {
            speech += translation.conditionToSpeech(conditionName, 'yes', place)
            speech += translation.forecastToSpeech(filteredReports)
        }
    }

    // const speech = translation.forecastToSpeech(formattedForecastData, place)
    logger.info('TTS: %s', speech)

    flow.end()
    return speech
}