const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const creds = require('./config.js')

app.use(express.json())
app.use(cors())


// Webcam
const CAM = require('./classes/webcam').default

const FPS = 7

setInterval(() => {
    const image = CAM.getBase64Image()
    if (image) io.emit('image', image)
}, 1000 / FPS)

// MQTT
// const MQTT = require('./classes/mqtt').default

// MYSQL
const MYSQL = require('./classes/mysql').default

// Serial
const SERIAL = require('./classes/serial').default

// credentials for mqtt
app.get('/creds', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.send(creds)
})

// ocr
app.get('/result', async (req, res) => {
    const { expected } = req.query
    const image = CAM.getImage()
    if (image) {
        try {
            const result = await CAM.recognizeImage(image)

            if (result) {
                console.log('Result:', result)
                res.send(result)
                // save expected + recognized word in database
                MYSQL.writeData({ word: result, expected })
                // increase counter
                if (result === expected)
                    MYSQL.addToCounter('CORRECT')
                else
                    MYSQL.addToCounter('INCORRECT')
            }
        } catch (err) {
            console.log(err)
        }
    } else {
        res.statusMessage = 'No match found'
        res.status(409).end()
    }
})

// ocr correct stats
app.get('/counter', async (req, res) => {
    const temp = await MYSQL.getCounters()
    res.send(temp)
})


// set ledstrip colors
app.get('/color', (req, res) => {
    const { color } = req.query
    if (color.length !== 9) {
        res.statusMessage = 'Number must be 9 characters'
        res.status(409).end()
    } else {
        SERIAL.writeLine(color)
        res.send(color)
    }
    console.log(`Color: ${color}`)
})


app.get('/test', async (req, res) => {
    const temp = await MYSQL.getCounters()
    console.log(temp)
    res.send('test')
})


server.listen(PORT, () => console.log(`server started on port ${PORT}...`))
