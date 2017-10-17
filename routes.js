const express = require('express')
const routes = express.Router()

var homeController = require('./controllers/homeController')
var userController = require('./controllers/userController')
var noticeController = require('./controllers/noticeController')
var categoryController = require('./controllers/categoryController')
var twitterController = require('./controllers/twitterController')

routes.get('/', homeController.getHome)

routes.get('/users', userController.getUsers)
routes.post('/users', userController.createUser)

routes.get('/users/:id', userController.getUser)
routes.put('/users/:id', userController.updateUser)
routes.delete('/users/:id', userController.removeUser)
/*
routes.get('/notices', noticeController.getNotices)
routes.post('/notices', noticeController.createNotice)
routes.get('/notices/:id', noticeController.getNotice)
routes.put('/notices/:id', noticeController.updateNotice)
routes.delete('/notices/:id', noticeController.removeNotice)

routes.get('/categories', categoryController.getCategories)
routes.post('/categories', categoryController.createCategory)
routes.get('/categories/:id', categoryController.getCategory)
routes.put('/categories/:id', categoryController.updateCategory)
routes.delete('/categories/:id', categoryController.removeCategory)

routes.get('/notices/:id/share', twitterController.shareTwitter)
routes.get('/notices/:id/search', twitterController.getNoticesTwitter)
*/
module.exports = routes;
