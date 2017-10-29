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
        default : Date()
    },
    views : Number,
    keywords : String,
    comments : [{
        comment : String,
        user : {
            type: mongoose.Schema.Types.ObjectId,
            ref : 'User'
        },
        date : {
            type: Date,
            default: Date()
        }
    }]
})

module.exports = mongoose.model('Notice', noticeSchema)
