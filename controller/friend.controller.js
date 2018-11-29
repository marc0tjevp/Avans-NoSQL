const ApiResponse = require('../model/response/api.response')
const neo = require('../neodb/neodbhelper')

function getThreadByDepth(req, res) {
	res.status(200).json(new ApiResponse(200, "Get friendship by depth Endpoint")).end()
}

function getByDepth(req, res) {

	// Get request parameters
	let username = req.params.username || ''
	let depth = req.params.depth || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (username == '' || depth == '') {
		res.status(412).json(new ApiResponse(412, "Please provide query parameters: username, depth")).end()
	}

	// Get all friends
	neo.getFriendships(res, username, depth, (rels) => {
		res.status(200).json(new ApiResponse(200, rels)).end()
	})

}

function addFriend(req, res) {

	// Get parameters
	let user1 = req.body.username1 || ''
	let user2 = req.body.username2 || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (user1 == '' || user2 == '') {
		res.status(412).json(new ApiResponse(412, "Please provide parameters: username1, username2")).end()
	}


	// Create friendship
	neo.createFriendship(res, user1, user2, (data) => {
		res.status(200).json(new ApiResponse(200, data)).end()
	})
}

function deleteByUsername(req, res) {

	// Get parameters
	let user1 = req.body.username1 || ''
	let user2 = req.body.username2 || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (user1 == '' || user2 == '') {
		res.status(412).json(new ApiResponse(412, "Please provide parameters: username1, username2")).end()
	}

	// Delete Friendship
	neo.deleteFriendship(res, user1, user2, (data) => {
		res.status(200).json(new ApiResponse(200, data)).end()
	})

}

function getAll(req, res) {

	let username = req.params.username || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (username == '') {
		res.status(412).json(new ApiResponse(412, "Please provide query parameter: username")).end()
	}

	// Get all friends
	neo.getFriendships(res, username, 1, (friends) => {
		res.status(200).json(new ApiResponse(200, friends)).end()
	})

}

module.exports = {
	getThreadByDepth,
	getByDepth,
	addFriend,
	deleteByUsername,
	getAll
}