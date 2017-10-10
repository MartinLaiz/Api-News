const express = require('express')
const routes = express.Router()

var homeController = require('./controllers/homeController')
var userController = require('./controllers/userController')

routes.get('/',homeController.getHome)
routes.get('/user',userController.getUsers)

module.exports = routes;
