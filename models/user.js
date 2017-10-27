const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    name : String,
    username : String,
    password : String,
    birthdate : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('User',userSchema)
