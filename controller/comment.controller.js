const ApiResponse = require('../model/response/api.response')

function getKarma(req, res) {
	res.status(200).end()
}

function voteUp(req, res) {
	res.status(200).end()
}

function voteDown(req, res) {
	res.status(200).end()
}

function updateById(req, res) {
	res.status(200).end()
}

function getByThreadId(req, res) {
	res.status(200).json(new ApiResponse(200, "Get friendship by depth Endpoint")).end()
}

function deleteById(req, res) {
	res.status(200).json(new ApiResponse(200, "Delete friend by name Endpoint")).end()
}

function create(req, res) {
	res.status(200).end()
}

function addTo(req, res) {
	res.status(200).end()
}

module.exports = {
	getKarma,
	voteDown,
	voteUp,
	updateById,
	getByThreadId,
	deleteById,
	create,
	addTo
}