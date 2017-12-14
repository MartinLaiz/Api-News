const User = require('../models/user');
const auth = require('./authController');

function login(req, res) {
    User.findOne({ username: req.body.username }, function(err, user) {
        if (err) {
            res.status(500).send({ message: 'Error login' })
        }
        else if (user && user.password == req.body.password) {
			res.status(200).send({
				message: 'Login correcto',
				token : auth.createToken(user)
            })
        }
        else {
            res.status(200).send({ message: 'Invalid credentials' })
        }
    })
}

function signup(req, res) {
	console.log('Registro ')
	console.log(req.body)
    User.findOne({ username: req.body.username }).
    exec(function(err, user) {
        if(err) res.status(500).send({ message: 'Error finding user' })
        else if(user) res.status(404).send({ message: 'User '+ req.body.username +' already exist' })
        else {
            User.create(req.body, function(err, user) {
                if(err) res.status(500).send({ message: 'Error creating user' })
                else if(user) res.status(200).send(user)
            })
        }
    })
}

function getUsers(req, res) {
    User.find({}).
    select('-password -__v -birthdate').
    exec(function(err, users) {
        if(err) res.status(500).send({ message : 'Error at users' })
        else if(users.length == 0) res.status(200).send({ message : 'No exist users' })
        else res.status(200).send(users)
    })
}

function getUser(req, res) {
    User.findById(req.params.id).
    select('-password -__v').
    exec(function(err, user) {
        if(err) res.status(400).send({ message: 'Error finding user'})
        else if(!user) res.status(404).send({ message: 'User not found'})
        else res.status(200).send(user)
    })
}

function updateUser(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            if(token.id == req.params.id){
                User.findOneAndUpdate({ _id: req.params.id }, { $set: req.body }, { new: true }).
                exe(function(err, user){
                    if(err) res.status(400).send({ message: 'Error finding user'})
                    if(!user) res.status(404).send({ message: 'User not found'})
                    res.status(200).send(user)
                })
            }
            else {
                res.status(401).send({ message: 'No tienes permisos para editar el usuario' })
            }
        }
        else {
            res.status(401).send(token)
        }
    })
}

function removeUser(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            if(token.id == req.params.id){
                User.findByIdAndRemove(req.params.id, function (err, user) {
                    if(err) res.status(400).send({ message: 'Error finding user'})
                    else if(!user) res.status(404).send({ message: 'User not found'})
                    else res.status(200).send({ message: 'Deleted user '+user.username })
                })
            }
            else {
                res.status(401).send({ message: 'No tienes permisos para editar el usuario' })
            }
        }
        else {
            res.status(401).send(token)
        }
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
