const Category = require('../models/category');

function getCategories(req, res) {
	console.log('Get categories')
	Category.find({}, function (err, categories) {
		if (err) res.status(500).send({ messaje: 'Error al crear la noticia' })
		if (!categories) res.status(200).send({ messaje: 'No exist categories' })
		res.status(200).send({ messaje: 'Ok', categories })
	})
}

function createCategory(req, res) {
	var messaje = 'OK'
	console.log(req.body)
	if (req.body.name) {
		Category.create({
			name: req.body.name
		}, function (err, category) {
			if (err) res.status(500).send({ messaje: 'Error al crear la noticia' })
			if (!category) res.status(200).send('No existe la categoria')
			res.status(200).send({ messaje: 'Ok', category })
		})
	}
}

function updateCategory(req, res) {
	auth.verifyToken(req.headers.authorization, function (token) {
		if (token.id) {
			Category.findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name } }, { new: true }, function (err, category) {
				if (err) res.status(500).send({ messaje: 'Error al modificar la categoria' })
				if (category.length == 0) res.status(200).send('No existe la categoria')
				res.status(200).send({ messaje: 'Ok', category })
			})
		}
		else {
			res.status(401).send(token)
		}
	})
}

function removeCategory(req, res) {
	console.log('Delete category' + req.params.id)
	Category.findOneAndRemove({ _id: req.params.id }, function (err, category) {
		console.log(category);
		if (err) res.status(500).send({ messaje: 'Error al borrar la categoria' })
		else if (!category) res.status(404).send('No existe la categoria')
		else res.status(200).send({ messaje: 'Categoria borrada' })
	})
}

module.exports = {
	getCategories,
	createCategory,
	updateCategory,
	removeCategory
}
