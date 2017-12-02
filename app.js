const port = process.env.PORT || 5000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors')

app.use(bodyParser.json())
app.use(cors())
mongoose.connect('mongodb://apiadi:apiadi@ds113925.mlab.com:13925/newsapp',{useMongoClient : true}, function(err){
    if(err) {
		console.log('no connect mlab database');
		mongoose.connect('mongodb://localhost:27017', {useMongoClient : true}, function(err){
            if(err) {
                console.log('no connect localhost database')
			}
			else {
				console.log('Connected to localhost database');				
			}
        })
    }
    else {
        console.log('Connected to mlab database')
	}
})

app.use('/',routes)

app.listen(port, function(err, res) {
    console.log('Runing server on port: ' + port )
})

module.exports = app;
