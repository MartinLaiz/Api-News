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
    if(!auth) {
        return {
            id: null,
            messaje: 'No authorization header'
        }
    }

    var token = auth.split(" ")[1];
    var payload = jwt.decode(token, secret_token);

    if(payload.exp <= moment().unix()) {
        return {
            id: null,
            messaje: 'Token expired'
        }
    }

    return User.findOne({ _id: payload.sub}, function(err, user) {
        if(err) {
            return {
                id: null,
                messaje: 'Error getting user auth'
            }
        }
        else if(!user) {
            return {
                id: null,
                messaje: 'No exist user auth'
            }
        }
        else {
            console.log(user._id);
            return {
                id: user._id,
                messaje: 'Correct token'
            }
        }
    })
}

module.exports = {
    createToken,
    verifyToken
}
