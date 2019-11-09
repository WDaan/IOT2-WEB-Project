const express = require('express')
const cors = require('cors')
const SerialPort = require('serialport')
const Readline = require('@serialport/parser-readline')

const PORT = process.env.PORT || 3000
const creds = require('./config.js')

// MQTT
const MQTT = require('./classes/mqtt').default


// serial com
// const port = new SerialPort("COM6", { baudRate: 115200 });
// const parser = port.pipe(new Readline("\n"));


// MYSQL
const MYSQL = require('./classes/mysql').default

let interval

// init express
const app = express()

app.use(express.json())
app.use(cors())

// credentials for mqtt
app.get('/creds', (req, res) => {
    res.set('Content-Type', 'application/json')
    res.send(creds)
})


// start interval
app.get('/startInterval', (req, res) => {
    interval = setInterval(() => {
        // let line
        // port.on('open', () => {
        //     console.log('Open')
        //     parser.on('data', (data) => {
        //         console.log(`data: ${data}`)
        //     })
        //     if (data.trim() !== '') {
        //         line = data

        //         serialPort.close(() => {
        //             console.log('closing')
        //         })
        //     }
        // })
        // send over mqtt
        MQTT.send('daan', 'bla')
    // add to myqsl database
    }, 10000)
    res.send('Success 😄')
})

app.get('/stopInterval', (req, res) => {
    clearInterval(interval)
    res.send('Success 😄')
})

// set leds color
app.post('/leds', (req, res) => {

})


app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))
