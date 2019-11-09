const mqtt = require('mqtt')

const creds = require('../config.js')

const client = mqtt.connect(String(`mqtt://${creds.MQTT_HOST}:14522`), {
    clientId: String(Math.floor(Math.random() * 10000)),
    username: creds.MQTT_USER,
    password: creds.MQTT_PASS,
})

client.on('connect', () => {
    console.log('MQTT connected')
    client.subscribe(['daan', 'temp'], (err) => {
        if (!err) {
            console.log('MQTT subscribed successfully 😄')
        }
    })
    client.on('message', (topic, message, packet) => {
        console.log(topic, message.toString())
    })
    client.on('error', (err) => console.log(err))
})

class MQTT {
    constructor() {
        console.log('MQTT client Created!')
    }

    send(topic, message) {
        client.publish(topic, message)
    }
}

exports.default = new MQTT()
