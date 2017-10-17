const Notice = require('../models/notice');

function getNotices(req, res) {
    Notice.find({},function(err, notices) {
        if(err) {
            res.status(500)
            return res.send({
                messaje : 'Error at notices'
            })
        }
        if(notices.length <= 0) {
            res.status(200)
            res.send({
                messaje : 'No notices found'
            })
        }
        else {
            res.status(200)
            res.send({
                notices
            })
        }
    })
}

function  createNotice(req, res) {

}

module.exports = {
    getNotices
}
