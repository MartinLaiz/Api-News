
function getTwitter(req, res) {
    Twitter.find({},function(err, tweets) {
        if(err) {
            res.status(500)
            return res.send({
                messaje : 'Error at tweets'
            })
        }
        if(tweets.length <= 0) {
            res.status(200)
            res.send({
                messaje : 'No tweets found'
            })
        }
        else {
            res.status(200)
            res.send({
                tweets
            })
        }
    })
}


module.exports = {
    getTwitter
}
