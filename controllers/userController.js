const User = require('../models/user');
const auth = require('./authController');

function login(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
            messaje =
            res.status(500).send({ messaje: 'Error login' })
        }
        else if (!user) {
            messaje = 'User not exist'
            res.status(200).send({ messaje: 'User not exist' })
        }
        else if (user && user.password == req.body.password) {
            auth.createToken(user, function(token) {
                res.status(200).send({
                    messaje: 'Login correcto',
                    token
                })
            })
        }
    })
}

function signup(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if(err) res.status(400).send({ messaje: 'Error finding user' })
        if(user) res.status(400).send({ messaje: 'User '+ req.body.username +' already exist' })
        else {
            User.create(req.body, function(err, user) {
                if(err) res.status(400).send({ messaje: 'Error creating user' })
                if(user) return login(req, res)
                res.status(200).send(user)
            })
        }
    })
}

function getUsers(req, res) {
    User.find({}).select('-password -__v -birthdate').exec(function(err, users) {
        if(err) res.status(500).send({ messaje : 'Error at users' })
        else if(users.length == 0) res.status(200).send({ messaje : 'No exist users' })
        else res.status(200).send(users)
    })
}

function getUser(req, res) {
    User.findById(req.params.id).select('-password -__v').exec(function(err, user) {
        if(err) res.status(400).send({ messaje: 'Error finding user'})
        else if(!user) res.status(404).send({ messaje: 'User not found'})
        else res.status(200).send(user)
    })
}

function updateUser(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            if(token.id == req.params.id){
                User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function(err, user){
                    if(err) res.status(400).send({ messaje: 'Error finding user'})
                    if(!user) res.status(404).send({ messaje: 'User not found'})
                    res.status(200).send(user)
                })
            }
            else {
                res.status(401).send({ messaje: 'No tienes permisos para editar el usuario' })
            }
        }
        else {
            res.status(401).send(token)
        }
    })
}

function removeUser(req, res) {
    User.findByIdAndRemove(req.params.id, function (err, user) {
        if(err) res.status(400).send({ messaje: 'Error finding user'})
        else if(!user) res.status(404).send({ messaje: 'User not found'})
        else res.status(200).send({ messaje: 'Deleted user '+user.username })
    })
}

module.exports = {
    login,
    signup,
    getUsers,
    getUser,
    updateUser,
    removeUser
}
