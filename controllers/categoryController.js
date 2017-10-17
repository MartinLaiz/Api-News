const Category = require('../models/category');

function getCategories(req, res) {
    Category.find({},function(err, categories) {
        if(err) {
            res.status(500)
            return res.send({
                messaje : 'Error at categories'
            })
        }
        if(categories.length <= 0) {
            res.status(200)
            res.send({
                messaje : 'No categories found'
            })
        }
        else {
            res.status(200)
            res.send({
                categories
            })
        }
    })
}

function  createCategory(req, res) {

}

module.exports = {
    getCategories
}
