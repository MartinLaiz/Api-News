const jwt = require('jwt-simple')
const moment = require('moment')
const User = require('../models/user')

var secret_token = 'miCadenaSecreta'

function createToken(user) {
    var payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(7, 'days').unix()
    }
    return jwt.encode(payload, secret_token)
}

function verifyToken(auth) {
    var response = {}
    if(!auth) {
        response = {
            id: null,
            messaje: 'No authorization header'
        }
    }

    var payload = jwt.decode(auth, secret_token);

    if(payload.exp <= moment().unix()) {
        response = {
            id: null,
            messaje: 'Token expired'
        }
    }
    User.findById({ _id: payload.sub}, function(err, user) {
        console.log(payload.sub);
        if(err) {
            response = {
                id: null,
                messaje: 'Error getting user auth'
            }
        }
        else if(!user) {
            response = {
                id: null,
                messaje: 'No exist user auth'
            }
        }
        else {
            response = {
                id: user._id,
                messaje: 'Correct token'
            }
        }
    })
    return response
}

module.exports = {
    createToken,
    verifyToken
}
