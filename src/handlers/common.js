const {
    time,
    message,
    location,
    weather,
    logger
} = require('../utils')
const { INTENT_PROBABILITY_THRESHOLD } = require('../constants')
const { getForecast } = require('../openWeatherClient')

/* Common logic performed for various intents */
module.exports = async function (msg, { mergeFormattedData = false } = {}) {

    if(msg.intent.probability < INTENT_PROBABILITY_THRESHOLD) {
        throw new Error('intentNotRecognized')
    }

    /* Extract slots */
    const timeSlots = message.getSlotsByName(msg, 'forecast_datetime')
    const countrySlot = message.getSlotsByName(msg, 'country', { onlyMostConfident: true })
    const regionSlot = message.getSlotsByName(msg, 'region', { onlyMostConfident: true })
    const citySlot = message.getSlotsByName(msg, 'city', { onlyMostConfident: true })

    /* Merge time slot values into time intervals */
    const timeIntervals = time.extractTimeIntervals(timeSlots)

    /* Extract target geonameid and name */
    const { geonameid: geoNameId, value: place, countryName } = location.extractGeoNameIdAndPlace(countrySlot, regionSlot, citySlot)

    logger.debug('timeIntervals: %O', timeIntervals)
    logger.debug('geoNameId: %s', geoNameId)
    logger.debug('place: %s', place)
    logger.debug('country name: %s', countryName)

    /* Perform an api call to retrieve the full forecast data at the target location */
    const fullForecast = await getForecast(geoNameId)
    /* And then filter the results based on the required time intervals */
    const forecastData = weather.filterForecastByIntervals(fullForecast, timeIntervals)

    logger.debug('filtered forecast data: %O', forecastData.map(_ => ({
        weather: _.weather,
        clouds: _.clouds,
        rain: _.rain,
        snow: _.snow,
        date: _.dt_txt
    })))

    /* Process the forecast 3 hours intervals into a list containing aggregated weather data grouped by days and day periods. */
    const aggregatedForecastData = weather.aggregateForecast(forecastData)
    logger.debug('aggregated forecast data: %O', aggregatedForecastData)

    /*
        Format the data into a list of time periods having i18n keys and weather reports
        and grouped by adjacent periods and weather type.
     */
    const formattedForecastData = weather.formatForecast(aggregatedForecastData, {
        mergeDays: mergeFormattedData,
        mergePeriods: mergeFormattedData
    })
    logger.info('formatted forecast data: %O', formattedForecastData)

    return {
        place: countryName ? place + ' ' + countryName : place,
        formattedForecastData
    }
}