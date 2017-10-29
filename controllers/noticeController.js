const Notice = require('../models/notice');

function getNotices(req, res) {
    var now = new Date()
    Notice.find({ publishdate: { $lte: now } }).
    populate({
        path: 'author',
        select: '-password -__v -birthdate'
    }).
    select('-__v -comments').
    exec(function(err, notices) {
        if(err) res.status(500).send({ messaje: 'Error al buscar la noticia', notices })
        if(notices==false) res.status(404).send({ messaje: 'Notices not found', notices })
        else {
            notices = notices.slice(0,20)
            notices = notices.map(function(x) {
                x.description = x.description.slice(0,100) + '...'
                return x
            })
            res.status(200).send({ messaje: 'Ok', notices })
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
    var messaje = 'OK'
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
                if(err) {
                    res.status(500)
                    messaje = 'Error al crear la noticia'
                }
                else res.status(200)
                res.send({
                    messaje,
                    notice
                })
            })
        }
        else {
            res.status(200).send({ messaje: 'You can not create a notice, first login or signup' })
        }
    }
}

function getNotice(req, res) {
    var messaje = 'OK'
    Notice.findById(req.params.id, function(err, notice) {
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
    Notice.findByIdAndRemove(req.params.id, function (err, notice) {
        var messaje = 'Noticia \''+ notice.title + '\' borrada'
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
            messaje
        })
    })
}

function getNoticesUser(req, res) {
    Notice.find({ author: req.params.id }).
    select('').
    exec()

}

module.exports = {
    getNotices,
    getNoticesCategory,
    getNoticesUser,
    createNotice,
    getNotice,
    updateNotice,
    removeNotice
}
