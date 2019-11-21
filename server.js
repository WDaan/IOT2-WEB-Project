const cv = require('opencv4nodejs')
const path = require('path')
const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000
const creds = require('./config.js')


const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)

const tesseract = require('node-tesseract-ocr')

//video capture
const config = {
  lang: 'nld',
  oem: 1,
  psm: 3,
}

const FPS = 10
const wCap = new cv.VideoCapture(0)


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
  const frame = wCap.read()
  const image = cv.imencode('.png', frame).toString('base64')
  cv.imwrite('test.png', frame)
  tesseract
    .recognize('test.png', config)
    .then((text) => {
      console.log('Resulst:', text)
      res.send(text.trim())
    })
    .catch((error) => {
      console.log(error.message)
      res.send(error.message)
    })
})

setInterval(() => {
  const frame = wCap.read()
  const image = cv.imencode('.png', frame).toString('base64')
  io.emit('image', image)
}, 1000 / FPS)

server.listen(PORT, () => console.log(`server started on ${PORT}`))
