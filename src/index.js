const { withHermes } = require('hermes-javascript')
const bootstrap = require('./bootstrap')
const handlers = require('./handlers')
const { translation, logger } = require('./utils')

// Initialize hermes
withHermes(async (hermes, done) => {
    try {
        // Bootstrap config, locale, mappings…
        await bootstrap()

        const dialog = hermes.dialog()

        // Subscribe to the app intents
        dialog.flows([
            {
                intent: 'davidsnips:WeatherForecast',
                action : handlers.weatherForecast
            },
            {
                intent: 'davidsnips:TemperatureForecast',
                action: handlers.temperatureForecast
            },
            {
                intent: 'davidsnips:WeatherConditionRequest',
                action: async function(msg, flow) {
                    /* Not supported yet */
                    flow.end()
                }
            }
        ])
    } catch (error) {
        // Output initialization errors to stderr and exit
        const message = await translation.errorMessage(error)
        logger.error(message)
        logger.error(error)
        done()
    }
})