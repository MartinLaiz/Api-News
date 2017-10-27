

const consumerKey = '7qQS44zHRwk1fNZsS2Y4cAspR'
const consumerSecret = 'kmID1HvhpWAsAXGl9LCgoPJpfGIdqpPJ0qL4ZRs8fziEbSqLAM'

function shareTwitter(req, res) {
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

function getNoticesTwitter(req, res) {

}

module.exports = {
    shareTwitter,
    getNoticesTwitter
}
