const Notice = require('../models/notice')
const request = require('request')
const base64 = require('base-64')

const consumerKey = '7qQS44zHRwk1fNZsS2Y4cAspR'
const consumerSecret = 'kmID1HvhpWAsAXGl9LCgoPJpfGIdqpPJ0qL4ZRs8fziEbSqLAM'

const postTweet = 'https://api.twitter.com/1.1/statuses/update.json?status='
const getTweets = 'https://api.twitter.com/1.1/search/tweets.json?q='
const getTweetsResultType = '&result_type=mixed'

function shareTwitter(req, res) {

}

function getToken(){
    request.post({
        url: 'https://api.twitter.com/oauth2/token',
        headers: {
            'Authorization': 'Basic '+ base64.encode(consumerKey + ':' + consumerSecret),
            'Content-Type': 'application/x-www-form-urlencoded',
            'User-Agent': 'my-twitter-client'
        },
        form: {
            'grant_type': 'client_credentials'
        }
    }, function(err, response, body) {
        console.log(response);
        console.log(body);
    })
}

function getNoticesTwitter(req, res) {
    res.status(200).send({ messaje: 'Ok' })
}

module.exports = {
    shareTwitter,
    getNoticesTwitter
}
