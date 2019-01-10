const {
    MIN_THRESHOLDS
} = require('../../constants')
const { periods } = require('./constants')

function resetAccumulatorItem(date) {
    return {
        startTime: date && date.getTime() || null,
        endTime: date && date.getTime() || null,
        maxTemp: null,
        minTemp: null,
        iterations: 0,
        cloudiness: 0,
        rain: 0,
        snow: 0,
        counters: {
            rain: 0,
            snow: 0
        }
    }
}

function updateAccumulatorItem (date, accumulatorItem, instantWeather, day = false) {
    // Take the min/max temps
    if(accumulatorItem.maxTemp === null || accumulatorItem.maxTemp < instantWeather.main.temp) {
        accumulatorItem.maxTemp = instantWeather.main.temp
    }
    if(accumulatorItem.minTemp === null || accumulatorItem.minTemp > instantWeather.main.temp) {
        accumulatorItem.minTemp = instantWeather.main.temp
    }
    // Sum up the cloudiness / rain / snow
    if(instantWeather.clouds) {
        accumulatorItem.cloudiness = accumulatorItem.cloudiness + instantWeather.clouds.all || 0
    }
    if(instantWeather.rain) {
        const amount = instantWeather.rain['3h'] || 0
        accumulatorItem.rain += amount
        if(amount >= MIN_THRESHOLDS.rain * 3)
            accumulatorItem.counters.rain++
    }
    if(instantWeather.snow) {
        const amount = instantWeather.snow['3h'] || 0
        accumulatorItem.snow += amount
        if(amount >= MIN_THRESHOLDS.snow * 3)
            accumulatorItem.counters.snow++
    }
    if(!day) {
        accumulatorItem.timeInterval = instantWeather.timeInterval
    }
    if(accumulatorItem.iterations === 0)
            accumulatorItem.startTime = date.getTime()
    accumulatorItem.endTime = date.getTime()
    accumulatorItem.iterations++
}

function finalizeAccumulatorItem (accumulatorItem) {
    accumulatorItem.cloudiness = accumulatorItem.cloudiness / accumulatorItem.iterations
    // We use (iterations * 3) because we want a number in millimeters per hours,
    // and the weather data has a period of 3 hours
    accumulatorItem.rain = accumulatorItem.rain / (accumulatorItem.iterations * 3)
    accumulatorItem.snow = accumulatorItem.snow / (accumulatorItem.iterations * 3)
}

function updateAccumulator (date, accumulator, instantWeather) {
    const hour = date.getHours() + 1

    let period = 'evening'
    if(hour < 12) {
        period = 'morning'
    }
    if(hour >= 12 && hour < 18) {
        period = 'afternoon'
    }

    updateAccumulatorItem(date, accumulator[period], instantWeather)
    updateAccumulatorItem(date, accumulator.day, instantWeather, true)
}

function finalizeAccumulator (accumulator) {
    delete accumulator.touched
    periods.forEach(period => {
        if(accumulator[period].iterations === 0) {
            delete accumulator[period]
        } else {
            finalizeAccumulatorItem(accumulator[period])
        }
    })
}

module.exports = {
    // Takes raw weather data every 3 hours interval, aggregate the data and group by day & part of the day
    aggregateForecast (forecastData) {
        const finalData = []

        let day = null
        let accumulator = null

        const resetAccumulator = date => {
            const accumulator = {}
            periods.forEach(period => {
                accumulator[period] = resetAccumulatorItem(date)
            })
            return accumulator
        }

        function pushAccumulator (date) {
            if(accumulator) {
                // Calculate means and store the accumulator
                finalizeAccumulator(accumulator)
                if(Object.keys(accumulator).length > 0)
                    finalData.push(accumulator)
            }
            if(date) {
                accumulator = resetAccumulator(date)
            }
        }

        forecastData.forEach(instantWeather => {
            const date = new Date(instantWeather.dt * 1000)

            if(day === null || date.getDay() !== day) {
                day = date.getDay()
                pushAccumulator(date)
            }
            updateAccumulator(date, accumulator, instantWeather)
        })

        if(accumulator)
            pushAccumulator(null)

        return finalData
    }
}