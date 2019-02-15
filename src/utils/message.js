function geometricMean(dataSet) {
    return Math.pow(dataSet.reduce((accumulator, element) => accumulator * element, 1), 1/dataSet.length)
}

module.exports = {
    getSlotsByName: (message, slotName, { threshold = 0, onlyMostConfident = false } = {}) => {
        if(onlyMostConfident) {
            return message.slots.reduce((acc, slot) => {
                if(slot.slot_name === slotName && slot.confidence > threshold) {
                    if(!acc || acc.confidence < slot.confidence)
                        return slot
                }
                return acc
            }, null)
        }
        return message.slots.filter(slot => slot.slot_name === slotName && slot.confidence > threshold)
    },
    getAsrConfidence(message) {
        return geometricMean(message.asr_tokens.map(token => token.confidence))
    }
}