const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.PORT || 3000

mongoose.connect('mongodb://apiadi:apiadi@ds113925.mlab.com:13925/newsapp',{useMongoClient : true})



app.get('/', function(req, res) {
    res.status(200)
    res.send({
        messaje: "Todo ok"
    })
})


app.listen(port, function(err, res) {
    console.log('Runing server on port: ' + port );
})
