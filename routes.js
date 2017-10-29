const express = require('express')
const routes = express.Router()

var homeController = require('./controllers/homeController')
var userController = require('./controllers/userController')
var noticeController = require('./controllers/noticeController')
var categoryController = require('./controllers/categoryController')
var twitterController = require('./controllers/twitterController')

routes.get('/', homeController.getHome)

routes.post('/login', userController.login)
routes.post('/signup', userController.signup)

routes.get('/users', userController.getUsers)
routes.get('/users/:id', userController.getUser)
routes.put('/users/:id', userController.updateUser)
routes.delete('/users/:id', userController.removeUser)

routes.get('/notices', noticeController.getNotices)
routes.get('/notices/author/:id', noticeController.getNoticesUser)
routes.post('/notices', noticeController.createNotice)
routes.get('/notices/:id', noticeController.getNotice)
routes.put('/notices/:id', noticeController.updateNotice)
routes.delete('/notices/:id', noticeController.removeNotice)

routes.get('/categories', categoryController.getCategories)
routes.post('/categories', categoryController.createCategory)
routes.get('/categories/:category', categoryController.getNoticesCategory)
routes.delete('/categories/:category', categoryController.removeCategory)
/*
routes.get('/notices/:id/share', twitterController.shareTwitter)
routes.get('/notices/:id/search', twitterController.getNoticesTwitter)
*/
module.exports = routes;
