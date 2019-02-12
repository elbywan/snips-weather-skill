const wretch = require('wretch').default
const { throttlingCache } = require('wretch-middlewares')
const { configFactory } = require('./factories')

const { HOUR_MILLISECONDS } = require('./constants')

let request = wretch('https://api.openweathermap.org/data/2.5')
    // Polyfill for nodejs
    .polyfills({
        fetch: require('node-fetch')
    })
    // Keep the response in cache for 10 minutes to avoid excessive usage
    .middlewares([
        throttlingCache({
            throttle: HOUR_MILLISECONDS / 6
        })
    ])

module.exports = {
    init() {
        request = request.query({
            units: 'metric',
            appid: configFactory.get().apiKey
        })
    },
    getCurrentForecast: async geonameid => {
        const result = await request
            .url('/weather')
            .query({
                id: geonameid
            })
            .get()
            .json()
            .catch(error => {
                // Network error
                if(error.name === 'TypeError')
                    throw new Error('APIRequest')
                // Other error
                throw new Error('APIResponse')
            })

        if(result.cod !== 200) {
            throw new Error(result.cod === 404 ? 'place' : 'APIResponse')
        }

        return result
    },
    getForecast: async geonameid => {
        const results = await request
            .url('/forecast')
            .query({
                id: geonameid
            })
            .get()
            .json()
            .catch(error => {
                // Network error
                if(error.name === 'TypeError')
                    throw new Error('APIRequest')
                // Other error
                throw new Error('APIResponse')
            })

        if(results.cod !== '200') {
            throw new Error(results.cod === '404' ? 'place' : 'APIResponse')
        }

        const currentWeather = await module.exports.getCurrentForecast(geonameid)

        // Format the current weather data to comply with the 3 hours API
        ;['snow', 'rain'].forEach(weather => {
            if(currentWeather[weather]) {
                currentWeather[weather]['3h'] = currentWeather[weather]['1h']
            } else {
                currentWeather[weather] = {}
            }
        })
        // Set the time in order to not overlap with other time ranges
        currentWeather.dt = (results.list[0].dt * 1000 - 3 * HOUR_MILLISECONDS) / 1000
        currentWeather.dt_txt = new Date(currentWeather.dt * 1000).toISOString()

        return [
            currentWeather,
            ...results.list
        ]
    }
}