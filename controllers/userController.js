const User = require('../models/user');

function getUsers(req, res) {
    User.find({},function(err, users) {
        if(err) {
            res.status(500)
            return res.send({
                messaje : 'Error at users'
            })
        }
        if(users.length <= 0) {
            res.status(200)
            res.send({
                messaje : 'No users found'
            })
        }
        else {
            res.status(200)
            res.send({
                users
            })
        }
    })
}

function createUser(req, res) {
    User.find({ username: req.body.username }, function(err, user) {
        if(err) res.status(400).send({ messaje: 'Error finding user' })
        if(user) res.status(400).send({ messaje: 'User already exist' })
        else {
            User.create(req.body, function(err, user) {
                if(err) res.status(400).send({ messaje: 'Error creating user' })
                res.status(200).send(user)
            })
        }
    })
}

function getUser(req, res) {
    User.findById(req.params.id, function(err, user) {
        if(err) res.status(400).send({ messaje: 'Error finding user'})
        else if(!user) res.status(404).send({ messaje: 'User not found'})
        else res.status(200).send(user)
    })
}

function updateUser(req, res) {
    console.log(req.body);
    User.findOneAndUpdate({ _id:req.params.id }, {$set: req.body}, {new: true}, function(err, user){
        if(err) res.status(400).send({ messaje: 'Error finding user'})
        else if(!user) res.status(404).send({ messaje: 'User not found'})
        else res.status(200).send(user)
    })
}

function removeUser(req, res) {

}

module.exports = {
    getUsers,
    createUser,
    getUser,
    updateUser,
    removeUser
}
