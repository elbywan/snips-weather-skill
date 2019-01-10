const {
    FORECAST_PERIOD
} = require('../../constants')

module.exports = {
    filterForecastInterval (fullForecast, timeInterval) {
        return module.exports.filterForecastByTimeIntervals(fullForecast, [timeInterval])
    },
    // Filter raw weather data segments and keep the ones that intersect with the given time intervals.
    filterForecastByIntervals (fullForecast, timeIntervals) {
        const filteredForecast = fullForecast.filter(segment => {
            const time = new Date(segment.dt * 1000).getTime()
            const matchingInterval = timeIntervals.find(interval => (
                (time >= interval.from && time < interval.to) ||
                ((interval.to - interval.from) <= FORECAST_PERIOD && (
                    // (interval.from === time && interval.to === time) ||
                    (interval.from >= time && interval.from < (time + FORECAST_PERIOD)))
                )
            ))
            if(matchingInterval)
                segment.timeInterval = matchingInterval
            return matchingInterval
        })
        if(filteredForecast.length < 1) {
            throw new Error('intersection')
        }
        return filteredForecast
    }
}