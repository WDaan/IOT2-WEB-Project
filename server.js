const express = require('express')
const cors = require('cors')

const PORT = process.env.PORT || 3000

const creds = require('./config.js')

// init express
const app = express()

app.use(express.json())
app.use(cors())

app.get('/creds', (req, res) => {
  res.set('Content-Type', 'application/json')
  res.send(creds)
})

app.listen(PORT, () => console.log(`Server listening on port ${PORT}!`))
