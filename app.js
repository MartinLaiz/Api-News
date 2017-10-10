const port = process.env.PORT || 3000
const express = require('express')
const app = express()
const mongoose = require('mongoose')
const routes = require('./routes');

// Base de datos local = mongodb://localhost:27017
// Base de datos externa = mongodb://apiadi:apiadi@ds113925.mlab.com:13925/newsapp
mongoose.connect('mongodb://localhost:27017',{useMongoClient : true}, function(err){
    if(err) {
        console.log('No connect database');
    }
    else {
        console.log('Connected to database');
    }
})

app.use('/',routes)

app.listen(port, function(err, res) {
    console.log('Runing server on port: ' + port );
})
