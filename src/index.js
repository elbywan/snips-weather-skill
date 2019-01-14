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
                intent: 'snips-assistant:WeatherForecast',
                action : handlers.weatherForecast
            },
            {
                intent: 'snips-assistant:TemperatureForecast',
                action: handlers.temperatureForecast
            },
            {
                intent: 'snips-assistant:WeatherConditionRequest',
                action: handlers.weatherCondition
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