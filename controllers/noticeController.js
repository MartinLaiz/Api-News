const Notice = require('../models/notice');

function getNotices(req, res) {
    var messaje = 'OK'
    Notice.find({}, function(err, notices) {
        if(err) {
            res.status(500)
            messaje = 'Error al crear la noticia'
        }
        else if(notices.length == 0) {
            res.status(200)
            messaje ='No exist notices'
        }
        else res.status(200)
        res.send({
            messaje,
            notices
        })
    })
}

function getNoticesCategoy(req, res) {
    var messaje = 'OK'
    Notice.find({ category: req.params.category }, function(err, notices) {
        if(err) {
            res.status(500)
            messaje = 'Error al crear la noticia'
        }
        else if(notices.length == 0) {
            res.status(200)
            messaje ='No exist notices'
        }
        else res.status(200)
        res.send({
            messaje,
            notices
        })
    })
}

function createNotice(req, res) {
    var messaje = 'OK'
    Notice.create({
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
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
    var messaje = 'OK'
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

module.exports = {
    getNotices,
    getNoticesCategoy,
    createNotice,
    getNotice,
    updateNotice,
    removeNotice
}
