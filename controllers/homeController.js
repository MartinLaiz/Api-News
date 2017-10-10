
function getHome(req, res) {
    res.status(200)
    res.send({
        messaje: 'Home page'
    })
}

module.exports = {
    getHome
}
