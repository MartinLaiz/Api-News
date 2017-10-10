const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    username : String,
    name : String,
    birthdate : {
        type : Date,
        default : Date.now
    }
})

module.exports = mongoose.model('User',userSchema)
