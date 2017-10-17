const mongoose = require('mongoose')

var noticeSchema = new mongoose.Schema({
    title : String,
    description : String,
    author : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    category : {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'Category'
    },
    publishdate : {
        type : Date,
        default : Date.now
    },
    views : Number,
    keywords : [{
        keyword : String
    }],
    comments : [{
        comment : String,
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        date : Date
    }]
})

module.exports = mongoose.model('Notice', noticeSchema)
