const jwt = require('jwt-simple')
const moment = require('moment')
const User = require('../models/user')

var secret_token = 'miCadenaSecreta'

function createToken(user, callback) {
    var payload = {
        id: user._id,
        username: user.username,
        iat: moment().unix(),
        exp: moment().add(5, 'days').unix()
    }
    callback(jwt.encode(payload, secret_token))
}

function verifyToken(auth, callback) {
    if(!auth) {
        callback({
            id: null,
            messaje: 'No auth'
        })
    }
    var payload
    try {
        payload = jwt.decode(auth, secret_token);
    } catch (e) {
        callback({
            id: null,
            messaje: 'Token expired'
        })
        return
    }
    User.findOne({ _id: payload.id}, function(err, user) {
        if(err) {
            callback({
                id: null,
                messaje: 'Error User'
            })

        }
        else if(!user) {
            callback({
                id: null,
                messaje: 'Wrong user'
            })

        }
        else {
            callback({
                id: user._id,
                messaje: 'Ok'
            })
        }
    })
}

module.exports = {
    createToken,
    verifyToken
}
