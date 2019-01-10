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
    INTENT_PROBABILITY_THRESHOLD: 0.5,
    MIN_THRESHOLDS: {
        rain: 0.1,
        snow: 0.05,
        cloudiness: 25
    }
}