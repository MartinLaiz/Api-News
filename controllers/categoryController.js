const Category = require('../models/category');

function getCategories(req, res) {
    var today = Date.now()
    Category.find({ publishdate: { $lte: today } }, function(err, categories) {
        if(err) res.status(500).send({ messaje: 'Error al crear la noticia' })
        if(categories.length == 0) res.status(200).send('No exist categories')
        categories = categories.slice(0,20)
        res.status(200).send({ messaje: 'Ok', categories })
    })
}

function getNoticesCategory(req, res) {
    var today = Date.now()
    Category.find({ category: req.params.category, publishdate: { $lte: today } }, function(err, categories) {
        if(err) res.status(500).send({ messaje: 'Error al crear la noticia' })
        if(categories.length == 0) res.status(200).send('No exist categories')
        categories = categories.slice(0,20)
        res.status(200).send({ messaje: 'Ok', categories })
    })
}

function createCategory(req, res) {
    var messaje = 'OK'
    Category.create({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        category: req.body.category,
        publishdate: req.body.publishdate,
        views: 0,
        keywords: req.body.keywords,
    }, function(err, category) {
        if(err) {
            res.status(500)
            messaje = 'Error al crear la noticia'
        }
        else res.status(200)
        res.send({
            messaje,
            category
        })
    })
}

function getCategory(req, res) {
    var messaje = 'OK'
    Category.findById(req.params.id, function(err, category) {
        if(err) {
            res.status(500)
            messaje = 'Error al crear la noticia'
        }
        else if(!category) {
            res.status(404)
            messaje = 'Category not found'
        }
        else res.status(200)
        res.send({
            messaje,
            category
        })
    })
}

function updateCategory(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            Category.findOne({ _id: req.params.id} ,function(err, category) {
                if(token.id == category.author){
                    Category.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function(err, category){
                        if(err) {
                            res.status(500)
                            messaje = 'Error al crear la noticia'
                        }
                        else if(!category) {
                            res.status(404)
                            messaje = 'Category not found'
                        }
                        else res.status(200)
                        res.send({
                            messaje,
                            category
                        })
                    })
                }else {
                    res.status(401).send({ messaje: 'No tienes permisos para editar el usuario' })
                }
            })
        }
        else {
            res.status(401).send(token)
        }
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

function removeCategory(req, res) {
    Category.findByIdAndRemove(req.params.id, function (err, category) {
        var messaje = 'Noticia \''+ category.title + '\' borrada'
        if(err) {
            res.status(500)
            messaje = 'Error al crear la noticia'
        }
        else if(!category) {
            res.status(404)
            messaje = 'Category not found'
        }
        else res.status(200)
        res.send({
            messaje
        })
    })
}

module.exports = {
    getCategories,
    getNoticesCategory,
    createCategory,
    getCategory,
    updateCategory,
    removeCategory
}
