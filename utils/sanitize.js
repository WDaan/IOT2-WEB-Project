function sanitize(text) {
    if (!text) return null
    text = text.trim()
    const reg = /^[a-zA-Z\s]+$/mi
    const match = text.match(reg)
    return match ? match[0].toString().toLowerCase().trim() : null
}

module.exports = sanitize
