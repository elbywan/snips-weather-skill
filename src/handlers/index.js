const { translation, logger } = require('../utils')

// Wrap handlers to gracefully capture errors
const handlerWrapper = handler => (
    async (message, flow) => {
        logger.debug('message: %O', message)
        try {
            // Run handler until completion
            const tts = await handler(message, flow)
            // And make the TTS speak
            return tts
        } catch (error) {
            // If an error occurs, end the flow gracefully
            flow.end()
            // And make the TTS output the proper error message
            logger.error(error)
            return await translation.errorMessage(error)
        }
    }
)

module.exports = {
    weatherForecast: handlerWrapper(require('./weatherForecast')),
    temperatureForecast: handlerWrapper(require('./temperatureForecast')),
}