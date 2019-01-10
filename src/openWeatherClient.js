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

        const { list } = results

        if(!list) {
            throw new Error('place')
        }

        return list
    }
}