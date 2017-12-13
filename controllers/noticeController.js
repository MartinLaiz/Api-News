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
			console.log(notices)
			notices = notices.slice(0,20)
            notices = notices.map(function(x) {
                x.description = x.description.slice(0,200) + '...'
                return x
			})
            res.status(200).send({ messaje: 'Ok', links, notices })
        }
    })
}

function createNotice(req, res) {
    var links = {
        mostrarUsuarios: '/users',
        mostrarCategoias: '/categories',
        mostrarNoticia: '/notices/_id'
    }
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
                else res.status(200).send({ messaje: 'Ok', links, notice })
            })
        }
        else {
            res.status(200).send({ messaje: 'You can not create a notice, first login or signup' })
        }
    })
}

function getNotice(req, res) {
    Notice.findOneAndUpdate(options, { $inc: { views: 1 } }).
    populate({
        path: 'comments.user',
        select: '-password -__v -birthdate'
    }).
    exec(function(err, notice) {
        if(err) res.status(500).send({ messaje: 'Error al crear la noticia' })
        else if(!notice) res.status(404).send({ messaje: 'Noticia no encontrada' })
        else res.status(200).send({ messaje: 'OK', notice })
    })
}

function updateNotice(req, res) {
    auth.verifyToken(req.headers.authorization, function(token) {
        if(token.id) {
            Notice.findOne({ _id: req.params.id} ,function(err, notice) {
                if(token.id.toString() == notice.author.toString()){
                    Notice.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true}, function(err, notice){
                        if(err) {
                            res.status(500)
                            messaje = 'Error al crear la noticia'
                        }
                        else if(!notice) {
                            res.status(404)
                            messaje = 'Noticia no encontrada'
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
    var links = {
        mostrarUsuarios: '/users',
        mostrarCategoias: '/categories',
        mostrarNoticias: '/notices'
    }
    auth.verifyToken(req.headers.authorization, function(token) {
        Notice.findOne({_id: req.params.id}).
        exec(function(err, notice) {
            if(err) res.status(500).send({ messaje: 'Error al buscar la noticia' })
            else if(!notice) res.status(404).send({ messaje: 'Noticia no encontrada' })
            else if(notice.author.toString() == token.id.toString()) {
                Notice.findOneAndRemove({_id: notice.id }).
                exec(function(err, notice) {
                    if(err) res.status(500).send({ messaje: 'Error al borrar la noticia' })
                    else if(!notice) res.status(404).send({ messaje: 'Notice not found' })
                    else res.status(200).send({ messaje: 'Noticia borrada', links })
                })
            }
            else {
                res.status(200).send({ messaje: 'No tienes permisos para realizar esta acción' })
            }
        })
    })
}

function getNoticesUser(req, res) {
    var links = {
        mostrarUsuarios: '/users',
        mostrarCategoias: '/categories',
        mostrarNoticias: '/notices',
        mostrarNoticia: '/notices/_id'
    }
    auth.verifyToken(req.headers.authorization, function(token) {
        let options = {
            author: req.params.id
        }
        if(token.id != req.params.id) {
            options.publishdate = { $lte: new Date() }
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
            if(err) res.status(500).send({ messaje: 'Error al cargar las noticias' })
            else if(!notices) res.status(404).send({ messaje: 'Notices not found' })

            notices = notices.slice(0,20)
            notices = notices.map(function(x) {
                x.description = x.description.slice(0,100) + '...'
                return x
            })
            res.status(200).send({ messaje: 'Ok', links, notices })
        })
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
                    messaje = 'Noticia no encontrada'
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
    getNoticesUser,
    createNotice,
    getNotice,
    updateNotice,
    removeNotice,
    postComment
}
