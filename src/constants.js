module.exports = {
    DEFAULT_LOCALE: 'english',
    SUPPORTED_LOCALES: [ 'english', 'french' ],
    DEFAULT_LANGUAGE: 'en',
    LANGUAGE_MAPPINGS: {
        english: 'en',
        french: 'fr'
    },
    HOUR_MILLISECONDS: 1000 * 60 * 60,
    DAY_MILLISECONDS: 1000 * 60 * 60 * 24,
    // 5 days
    FORECAST_DAYS_LIMIT: 1000 * 60 * 60 * 24 * 5,
    // Forecast granularity - 3 hours
    FORECAST_PERIOD: 1000 * 60 * 60 * 3,
    DAY_LIST: [
        'sunday',
        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday'
    ],
    SLOT_THRESHOLD: 0,
    ASR_THRESHOLD: 0.5,
    INTENT_THRESHOLD: 0.5,
    INTENT_FILTER_THRESHOLD: 0,
    MIN_THRESHOLDS: {
        rain: 0.1,
        snow: 0.05,
        cloudiness: 25
    },
    CONDITIONS_MAPPINGS: {
        fr: {
            froid: 'cold',
            chaud: 'warm',
            neige: 'snow',
            pluie: 'rain'
            // TODO (after it is ported in the french app)
        },
        en: {
            cold: 'cold',
            warm: 'warm',
            snow: 'snow',
            rain: 'rain',
            clear: 'sun',
            cloudy: 'clouds'
        }
    },
    TEMPERATURE_TRESHOLDS: {
        cold: 10,
        warm: 20
    }
}