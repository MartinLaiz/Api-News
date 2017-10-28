const User = require('../models/user');
const auth = require('./authController');

function login(req, res) {
    var messaje = 'Login correcto'
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
            messaje = 'Error login'
            res.status(500)
        }
        else if (!user) {
            messaje = 'User not exist'
            res.status(200)
        }
        else if (user && user.password == req.body.password) {
            return res.status(200).send({
                messaje,
                token: auth.createToken(user)
            })
        }
        res.send({ messaje })
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
    User.find({}).select('-password -__v').exec(function(err, users) {
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
    var token = auth.verifyToken(req.headers.authorization.split(" ")[1])
    console.log('-------- Token ----------');
    console.log(token);
    console.log('-------- Token ----------');

    if(token.id) {
        if(token.id == req.params.id){
            User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function(err, user){
                if(err) res.status(400).send({ messaje: 'Error finding user'})
                else if(!user) res.status(404).send({ messaje: 'User not found'})
                else res.status(200).send(user)
            })
        }
        else {
            res.status(401).send({ messaje: 'No puedes editar el usuario' })
        }
    }
    else {
        res.status(401).send(token.messaje)
    }
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
