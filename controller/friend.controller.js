const ApiResponse = require('../model/response/api.response')

function getThreadByDepth(req, res) {
	res.status(200).json(new ApiResponse(200, "Get friendship by depth Endpoint")).end()
}

function getByDepth(req, res) {
	res.status(200).json(new ApiResponse(200, "Update Endpoint")).end()
}

function addFriend(req, res) {
	res.status(200).end()
}

function deleteByUsername(req, res) {
	res.status(200).json(new ApiResponse(200, "Delete friend by name Endpoint")).end()
}

function getAll(req, res) {
	res.status(200).json(new ApiResponse(200, "Get All friends Endpoint")).end()
}

module.exports = {
	getThreadByDepth,
	getByDepth,
	addFriend,
	deleteByUsername,
	getAll
}