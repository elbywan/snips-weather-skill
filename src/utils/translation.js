const i18nFactory = require('../factories/i18nFactory')
const { trimStart } = require('./string')

module.exports = {
    errorMessage: async error => {
        let i18n = i18nFactory.get()

        if(!i18n) {
            await i18nFactory.init()
            i18n = i18nFactory.get()
        }

        if(i18n) {
            return i18n([`error.${error.message}`, 'error.unspecific'])
        } else {
            return 'Oops, something went wrong.'
        }
    },
    randomTranslation (key, opts) {
        const i18n = i18nFactory.get()
        const possibleValues = i18n(key, { returnObjects: true, ...opts })
        const randomIndex = Math.floor(Math.random() * possibleValues.length)
        return possibleValues[randomIndex]
    },
    joinTerms(list) {
        if(!list || list.length < 2)
            return list && list[0] || ''

        const i18n = i18nFactory.get()
        let joinedString = ''
        for (let i = 0; i < list.length; i++) {
            const element = list[i]

            if(i === (list.length - 1)) {
                joinedString += ' ' + i18n('joins.andSomething', { something: element }) + ' '
                continue
            } else if(i > 0) {
                joinedString += ', '
            }

            joinedString += element
        }
        return joinedString
    },
    forecastToSpeech (formattedWeatherData, place) {
        const i18n = i18nFactory.get()
        const { joinTerms, randomTranslation } = module.exports
        let lastDay = null
        let firstDay = true

        return formattedWeatherData.reduce((speech, day) => {
            let time = ''
            let predictions = ''
            let temperatures = ''

            const sameDay = lastDay === day.days[0]
            lastDay = day.days[day.days.length - 1]

            if(day.labels.size === 0 && !sameDay) {
                time = joinTerms(day.days.map(day => i18n('days.' + day)))
            } else {
                if(!sameDay && !day.customLabel)
                    time = day.days[0] + ', '
                time += joinTerms(Array.from(day.labels).map(label => i18n('partOfDay.' + label, label || '')))
            }

            const weatherAdjective = ('quantifier' in day.report) ? 'quantifier' : 'qualifier'

            const weather =
                i18n(weatherAdjective + '.' + day.report[weatherAdjective], '') +
                ' ' +
                i18n('weatherTypes.' + weatherAdjective + '.' + day.report.type)
            predictions += randomTranslation('forecast.weather.prediction.' + weatherAdjective, { weather })

            if(day.temperatures.min !== day.temperatures.max) {
                temperatures += randomTranslation('forecast.weather.temperatures.range', {
                    minTemp: day.temperatures.min, maxTemp: day.temperatures.max
                })
            } else {
                temperatures += randomTranslation('forecast.weather.temperatures.exact', {
                    temperature: day.temperatures.min
                })
            }

            const daySentence = trimStart(i18n('forecast.weather.day', {
                time,
                predictions,
                temperatures,
                place: firstDay ? place : null,
                context: firstDay ? 'place' : null
            }))

            firstDay = false

            speech += daySentence.charAt(0).toUpperCase() + daySentence.slice(1) + '\n'
            return speech
        }, '')
    },
    temperatureToSpeech (formattedWeatherData, place) {
        const i18n = i18nFactory.get()
        const { joinTerms, randomTranslation } = module.exports
        let lastDay = null
        let firstDay = true

        return formattedWeatherData.reduce((speech, day) => {
            let time = ''
            let temperatures = ''

            const sameDay = lastDay === day.days[0]
            lastDay = day.days[day.days.length - 1]

            if(day.labels.size === 0 && !sameDay) {
                time = joinTerms(day.days.map(day => i18n('days.' + day)))
            } else {
                if(!sameDay && !day.customLabel)
                    time = day.days[0] + ', '
                time += joinTerms(Array.from(day.labels).map(label => i18n('partOfDay.' + label, label || '')))
            }

            if( day.temperatures.min !== day.temperatures.max) {
                temperatures += randomTranslation('forecast.temperatures.temperatures.range', {
                    minTemp: day.temperatures.min, maxTemp: day.temperatures.max
                })
            } else {
                temperatures += randomTranslation('forecast.temperatures.temperatures.exact', {
                    temperature: day.temperatures.min
                })
            }

            const daySentence = trimStart(i18n('forecast.temperatures.day', {
                time,
                temperatures,
                place: firstDay ? place : null,
                context: firstDay ? 'place' : null
            }))

            firstDay = false

            speech += daySentence.charAt(0).toUpperCase() + daySentence.slice(1) + '\n'
            return speech
        }, '')
    }
}