const Notice = require('../models/notice');
const auth = require('../controllers/authController');

function getNotices(req, res) {
    var now = new Date()
    var options = { publishdate: { $lte: now } }
    var links = {
        mostrarUsuarios: '/users',
        mostrarCategoias: '/categories',
        mostrarNoticia: '/notices/_id'
    }
    if(req.query.category) {
        options.category = req.query.category
    }
    if(req.query.author) {
        options.author = req.query.author
    }
    Notice.find(options).
    populate([{
        path: 'author',
        select: '-password -__v -birthdate'
    },{
        path: 'category',
        select: '-__v'
    }]).
    select('-__v -comments').
    exec(function(err, notices) {
        if(err) res.status(500).send({ messaje: 'Error al buscar la noticia', notices, links })
        if(notices==false) res.status(404).send({ messaje: 'Notices not found', notices, links })
        else {
            notices = notices.slice(0,20)
            notices = notices.map(function(x) {
                x.description = x.description.slice(0,100) + '...'
                return x
            })
            res.status(200).send({ messaje: 'Ok', links, notices })
        }
    })
}

function getNoticesCategory(req, res) {
    var today = new Date()
    Notice.find({ category: req.params.category, publishdate: { $lte: today } }).
    exec(function(err, notices) {
        if(err) res.status(500).send({ messaje: 'Error al crear la noticia' })
        if(notices.length == 0) res.status(200).send('No exist notices')
        notices = notices.slice(0,20)
        res.status(200).send({ messaje: 'Ok', notices })
    })
}

function createNotice(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            Notice.create({
                title: req.body.title,
                description: req.body.description,
                author: token.id,
                category: req.body.category,
                publishdate: req.body.publishdate,
                views: 0,
                keywords: req.body.keywords,
            }, function(err, notice) {
                if(err) res.status(500).send({ messaje: 'Error al crear la noticia', error: err })
                else res.status(200).send({ messaje: 'Ok',notice})
            })
        }
        else {
            res.status(200).send({ messaje: 'You can not create a notice, first login or signup' })
        }
    })
}

function getNotice(req, res) {
    Notice.findOneAndUpdate({ _id: req.params.id }, { $inc: { views: 1 } }).
    populate({
        path: 'comments.user',
        select: '-password -__v -birthdate'
    }).
    exec(function(err, notice) {
        if(err) res.status(500).send({ messaje: 'Error al crear la noticia' })
        else if(!notice) res.status(404).send({ messaje: 'Notice not found' })
        else res.status(200).send({ messaje: 'OK', notice })
    })
}

function updateNotice(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            Notice.findOne({ _id: req.params.id} ,function(err, notice) {
                if(token.id == notice.author){
                    Notice.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function(err, notice){
                        if(err) {
                            res.status(500)
                            messaje = 'Error al crear la noticia'
                        }
                        else if(!notice) {
                            res.status(404)
                            messaje = 'Notice not found'
                        }
                        else res.status(200)
                        res.send({
                            messaje,
                            notice
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

function removeNotice(req, res) {
    Notice.findByIdAndRemove(req.params.id).
    exec(function (err, notice) {
        if(err) res.status(500).send({ messaje: 'Error al crear la noticia' })
        else if(!notice) res.status(404).send({ messaje: 'Notice not found' })
        else res.status(200).send({ messaje: 'Noticia borrada' })
    })
}

function getNoticesUser(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id){
            Notice.find({ author: req.params.id }).
            select('').
            exec(function(err, notices) {
                if(err) res.status(500).send({ messaje: 'Error al cargar las noticias' })
                else if(!notice) res.status(404).send({ messaje: 'Notices not found' })
                else res.status(200).send({ messaje: 'Ok', notices })
            })
        }
        else {
            res.status(200).send({ messaje: 'Error id' })
        }
    })
}

function postComment(req, res){
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id){
            var comment = {
                comment: req.body.comment,
                user: token.id
            }
            Notice.findOneAndUpdate(
                { _id: req.params.id },
                { $push: { comments: comment } }
            ).
            exec(function(err, notice) {
                if(err) {
                    res.status(500)
                    messaje = 'Error al comentar la noticia'
                }
                else if(!notice) {
                    res.status(404)
                    messaje = 'Notice not found'
                }
                else res.status(200)

            })
        }
        else {
            res.status(200).send({ messaje: 'Error id' })
        }
    })
}

module.exports = {
    getNotices,
    getNoticesCategory,
    getNoticesUser,
    createNotice,
    getNotice,
    updateNotice,
    removeNotice,
    postComment
}
