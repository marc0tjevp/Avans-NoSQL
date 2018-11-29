const ApiResponse = require('../model/response/api.response')
const User = require('../model/schema/user.schema')
const auth = require('../config/authentication.config')


function getByName(req, res) {

	// Get parameters from query
	let uname = req.params.username || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (uname == '') {
		res.status(412).json(new ApiResponse(412, "Please provide query parameter: username")).end()
	}

	// Find the user
	User.findOne({ username: uname }, {password: 0},
		function (err, user) {
			res.status(200).json(new ApiResponse(200, user)).end()
		}
	)

}

function update(req, res) {

	// Get parameters from body
	let uname = req.body.username || ''
	let pass = req.body.password || ''
	let newpassword = req.body.newpassword || ''

	// Get token from header
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername= auth.decodeToken(token)
	}

	// Check if all params are present
	if (uname == '' || pass == '' || newpassword == '') {
		res.status(412).json(new ApiResponse(412, "Please provide the parameters: username, password, newpassword")).end()
	}

	// Check for Authorization
	if (!token || !decodedUsername) {
		res.status(413).json(new ApiResponse(413, "You need to be logged in to update your password")).end()
	}

	// Find the user
	User.findOne({
			username: uname
		},

		function (err, user) {

			// If givenpassword equals the "old" password
			if (pass == user.password) {

				// Change the password
				user.password = newpassword

				// Save the changes
				user.save(function (err) {
					if (err) {
						res.status(500).json(new ApiResponse(200, err)).end()
					} else {
						res.status(200).json(new ApiResponse(200, "Changed password for user " + user.username)).end()
					}
				})
			}

			// Notify the user that the provide password does not match the current password
			else {
				res.status(413).json(new ApiResponse(200, "Old password does not match database")).end()
			}
		})
}

function getAll(req, res) {

	// Get all Users
	User.find({}, {
		_id: 0,
		password: 0
	}, function (err, users) {

		var userMap = {}

		// Map Users by username
		users.forEach(function (user) {
			userMap[user.username] = user
		})

		// Return the array
		res.status(200).json(new ApiResponse(200, userMap)).end()
	})

}

module.exports = {
	getByName,
	update,
	getAll
}