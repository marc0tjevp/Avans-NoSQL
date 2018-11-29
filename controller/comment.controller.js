const ApiResponse = require('../model/response/api.response')
const neodb = require('../neodb/neodbhelper')
const User = require('../model/schema/user.schema')
const Thread = require('../model/schema/thread.schema')
const Comment = require('../model/schema/comment.schema').Comment
const auth = require('../config/authentication.config')

function getKarma(req, res) {
	// Get params
	let id = req.params.id || ''

	// If ID is missing let user know
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Please provide the parameters: id"))
	}

	// Get Up- and Downvotes
	neodb.getCommentDownvotes(res, id, (downVotes) => {
		neodb.getCommentUpvotes(res, id, (upVotes) => {
			res.status(200).json(new ApiResponse(200, "Karma = " + upVotes + "  - " + downVotes + " = " + (upVotes - downVotes)))
		})
	})
}

function voteUp(req, res) {

	// Get params
	let id = req.params.id || ''

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Check if ID is missing
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "No threadID given"))
	}

	// Create upvote
	neodb.createCommentUpvote(res, decodedUsername.sub, id, () => {
		res.status(200).json(new ApiResponse(200, decodedUsername.sub + " upvoted the thread with id: " + id))
	})

}

function voteDown(req, res) {

	// Get params
	let id = req.params.id || ''

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Check if ID is missing
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Please provide the parameters: threadID"))
	}

	// Create upvote
	neodb.createCommentDownvote(res, decodedUsername.sub, id, () => {
		res.status(200).json(new ApiResponse(200, decodedUsername.sub + " upvoted the thread with id: " + id))
	})
}

function updateById(req, res) {

	// Get params
	let id = req.params.id || ''
	let newContent = req.body.content || ''

	// Check if params are missing
	if (id == '' || newContent == '') {
		res.status(400).json(new ApiResponse(400, "Please provide the parameters: id, newContent"))
	}

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Find the user and update the comment
	User.findOne({
		username: decodedUsername.sub
	}, {}, (err, u) => {
		Comment.findOne({
			commentID: id,
			user: u
		}, {}, (err, c) => {
			if (t) {
				Comment.UpdateOne(c, {
					content: newContent
				}, (err) => {
					res.status(200).json(new ApiResponse(200, "Comment has been updated")).end()
				})
			}
			res.status(401).json(new ApiResponse(401, "Not Authorised to update comment"))
		})
	})
}

function getByThreadId(req, res) {

	// Get params
	let id = req.params.id || ''

	// Check if ID is missing
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Please provide the parameters: threadID"))
	}

	// Get comment by thread ID
	Thread.findOne({
		threadID: id
	}, {
		comments: 1,
		_id: 0
	}, (err, c) => {
		res.status(200).json(new ApiResponse(200, c.comments)).end()
	})
}

function deleteById(req, res) {

	// Get params
	let id = req.params.id || ''

	// Check if ID is missing
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Please provide the parameters: threadID"))
	}

	//Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Find user and delete comment by id
	User.findOne({
		username: decodedUsername.sub
	}, {}, (err, u) => {
		Comment.findOne({
			commentID: id,
			user: u
		}, {}, (err, c) => {
			if (t) {
				Comment.DeleteOne(c), (err) => {
					if (err) {
						res.status(401).json(new ApiResponse(401, "Not Authorised to delete"))
					}
					res.status(200).json(new ApiResponse(200, "deleted")).end()
				}
			}
		})
	})
}

function create(req, res) {

	// Get params
	let id = req.params.id || ''
	let content = req.body.content

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Check if params are missing
	if (id == '' || content) {
		res.status(400).json(new ApiResponse(400, "Please provide the parameters: threadID, content"))
	}

	// Find user
	User.findOne({
		username: decodedUsername.sub
	}, {}, (err, u) => {

		// Find thread
		Thread.findOne({
			threadID: id
		}, {}, (err, t) => {

			// Create Comment
			var comment = new Comment({
				threadID: t,
				content: content,
				user: u
			})

			// Save the comment
			comment.save(function (err, c) {
				neodb.saveComment(res, c.commentID, () => {
					res.status(200).json(new ApiResponse(200, c)).end()
				})
			})

		})

	})
}

function addTo(req, res) {
	
	// Get params
	let id = req.params.id || ''
	let content = req.body.content

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	User.findOne({
		username: decodedUsername.sub
	}, {}, (err, u) => {
		var comment = new Comment({
			content: content,
			user: u
		})
		comment.save(function (err, c) {
			Comment.update({
				commentID: id
			}, {
				comments: comments.concat([comment])
			}, (err) => {
				neodb.saveComment(res, comment.commentID, () => {
					res.status(200).json(new ApiResponse(200, c)).end()
				})
			})

		})
	})
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