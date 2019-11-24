const cv = require('opencv4nodejs')
const tesseract = require('node-tesseract-ocr')
const sanitize = require('../utils/sanitize')

// tesseract config
const config = {
    lang: 'nld',
    oem: 1,
    psm: 3,
}


class Webcam {
    constructor() {
        try {
            this.wCap = new cv.VideoCapture(0)
        } catch (err) {
            console.log('Error connecting webcam')
        }
        console.log('Webcam helper created!')
    }

    getBase64Image() {
        if (this.wCap) {
            const frame = this.wCap.read()
            return cv.imencode('.png', frame).toString('base64')
        }
        return null
    }

    getImage() {
        const imgName = 'test.png'
        if (this.wCap) {
            const frame = this.wCap.read()
            cv.imwrite(imgName, frame)
            return imgName
        }
        return null
    }

    // eslint-disable-next-line class-methods-use-this
    async recognizeImage(img) {
        return new Promise(async (res, rej) => {
        // run ocr on picture
            let result = await tesseract.recognize(img, config)
            console.log(`Result: ${result}`)
            // check if result is alphanumeric
            result = sanitize(result)
            return result ? res(result) : rej('Nothing found')
        })
    }
}


exports.default = new Webcam()
