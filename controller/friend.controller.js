const ApiResponse = require('../model/response/api.response')

function getThreadByDepth(req, res) {
	res.status(200).json(new ApiResponse(200, "Get friendship by depth Endpoint")).end()
}

function getByDepth(req, res) {

	// Get request parameters
	let username = req.params.username || ''
	let depth = req.params.depth || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (username == '' || depth == '') {
		res.status(412).json(new ApiResponse(412, "Please provide query parameter: username")).end()
	}

	// Get all friends
	neo.getFriendships(res, username, depth)

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