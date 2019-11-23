const cv = require('opencv4nodejs')
const path = require('path')
const express = require('express')
const cors = require('cors')
const SerialPort = require('serialport')

// serialport config
const port = new SerialPort('/dev/ttyACM0', {
    baudRate: 115200,
    autoOpen: false,
})


const PORT = process.env.PORT || 3000


const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const tesseract = require('node-tesseract-ocr')
const creds = require('./config.js')

// video capture config
const config = {
    lang: 'nld',
    oem: 1,
    psm: 3,
}
let wCap

const FPS = 7

try {
    wCap = new cv.VideoCapture(0)
    setInterval(() => {
        const frame = wCap.read()
        const image = cv.imencode('.png', frame).toString('base64')
        io.emit('image', image)
    }, 1000 / FPS)
} catch (err) {
    console.log('error connecting webcam')
}


// MQTT
const MQTT = require('./classes/mqtt').default


// MYSQL
const MYSQL = require('./classes/mysql').default


app.use(express.json())
app.use(cors())

// credentials for mqtt
app.get('/creds', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.send(creds)
})

app.get('/result', (req, res) => {
    const { expected } = req.query
    if (wCap != undefined && wCap != null) {
        const frame = wCap.read()
        const image = cv.imencode('.png', frame).toString('base64')
        cv.imwrite('test.png', frame)
        tesseract
            .recognize('test.png', config)
            .then((text) => {
                text = text.trim()
                const reg = /^[a-z0-9]+$/i
                let match = text.match(reg)
                if (match != ' ' && match != '' && match != null) {
                    match = match[0].toString().toLowerCase()
                    console.log('Result:', match)
                    res.send(match)
                    MYSQL.writeData({ word: match, expected })
                    if (text == expected) {
                        MYSQL.addToCounter('CORRECT')
                    } else {
                        MYSQL.addToCounter('INCORRECT')
                    }
                } else {
                    res.statusMessage = 'No match found'
                    res.status(409).end()
                }
            })
            .catch((error) => {
                console.log(error.message)
                res.send(error.message)
            })
    } else {
        res.statusMessage = 'Webcam not connected'
        res.status(409).end()
    }
})


app.get('/color', (req, res) => {
    const {
        color,
    } = req.query
    if (color.length != 9) {
        res.statusMessage = 'Number must be 9 characters'
        res.status(409).end()
    } else {
        port.open((error) => {
            if (error) console.log('Error opening..')
            else {
                port.write(color)
                port.close()
            }
        })
        res.send(color)
    }

    console.log("Color: " + color)
})

app.get('/counter', async (req, res) => {
    const temp = await MYSQL.getCounters()
    res.send(temp)
})

app.get('/test', async (req, res) => {
    const temp = await MYSQL.getCounters()
    console.log(temp)
    res.send('test')
})

server.listen(PORT, () => console.log(`server started on ${PORT}`))
