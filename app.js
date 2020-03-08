const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())

app.use('/', routes)

app.listen(port, function (err, res) {
	console.log('Runing server on port: ' + port)
})

module.exports = app;
