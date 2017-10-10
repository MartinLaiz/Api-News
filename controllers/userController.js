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

function  createUser(req, res) {

}

module.exports = {
    getUsers
}
