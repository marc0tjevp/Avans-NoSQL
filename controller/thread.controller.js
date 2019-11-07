const ApiResponse = require('../model/response/api.response')
const User = require('../model/schema/user.schema')
const Thread = require('../model/schema/thread.schema')
const auth = require('../config/authentication.config')
const neodb = require('../neodb/neodbhelper')
const neo = require('../neodb/seraphhelper')

function getThreadById(req, res) {

	// Get params
	let threadId = req.params.id || ''

	// Check if ID exists
	if (threadId == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: id"))
	}

	Thread.findOne({
			_id: threadId
		}, {
			comments: 0
		},
		function (err, thread) {
			if (thread) {
				res.status(200).json(new ApiResponse(200, thread)).end()
			} else {
				res.status(404).json(new ApiResponse(404, "Thread not found")).end()
			}
		}
	)

}

function getKarma(req, res) {

	// Get params
	let id = req.params.id || ''

	// Check if ID exists
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: id"))
	}

	// Get Karma
	neo.getAllRels({id:id},"upvoted",(err,down) => {
		neo.getAllRels({id:id},"downvoted",(err,up)=>{
			var downVotes = down.length || 0
			var upVotes = up.length || 0
			res.status(200).json(new ApiResponse(200, "Karma = " + upVotes + "  - " + downVotes + " = " + (upVotes - downVotes))).end()
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

	// Check if ID exists
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: id"))
	}

	// Create upvote
	neo.saveRel({username:decodedUsername.sub},"upvoted",{id:id},null,(err)=>{
		if(err){
			res.status(200).json(new ApiResponse(500, "Something went wrong, please contact the owners")).end()
		} else{
			res.status(200).json(new ApiResponse(200, decodedUsername.sub + " upvoted the thread with id: " + id)).end()
		}
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

	// Check if ID exists
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: id"))
	}

	// Create downvote
	neo.saveRel({username:decodedUsername.sub},"downvoted",{id:id},null,(err)=>{
		if(err){
			res.status(200).json(new ApiResponse(500, "Something went wrong, please contact the owners")).end()
		} else{
			res.status(200).json(new ApiResponse(200, decodedUsername.sub + " downvoted the thread with id: " + id)).end()
		}
	})
}

function create(req, res) {

	// Get params
	let t = req.body.title || ''
	let con = req.body.content || ''

	// Check if ID exists
	if (t == '' || con == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: title, content"))
	}

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Create Thread
	User.findOne({
			username: decodedUsername.sub
		}, {
			_id: 1
		},
		function (err, u) {
			var thread = new Thread({
				user: u._id,
				title: t,
				content: con
			})
			thread.save(function (err) {
				console.log(err)
				Thread.findOne(thread, {}, (err, t) => {
					neo.saveNode({id:t._id},"Thread",(err,thread)=>{
						res.status(200).json(new ApiResponse(200, t)).end()
					})
				})


			})
		}
	)


}

function deleteById(req, res) {

	// Get params
	let id = req.params.id || ''

	// Check if ID exists
	if (id == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: id"))
	}

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Delete Thread
	User.findOne({
		username: decodedUsername.sub
	}, {}, (err, u) => {

		Thread.findOne({
			_id: id,
			user: u._id
		}, {}, (err, t) => {

			if (t) {
				Thread.deleteOne(t, (err) => {
					neo.deleteNode({id:id},(err)=>{
						if(err){
							res.status(500).json(new ApiResponse(500,"Something went wrong, please contact the owners")).end()
						} else{
							res.status(200).json(new ApiResponse(200, "deleted")).end()
						}
					})
				})
			} else {
				res.status(401).json(new ApiResponse(401, "Not Authorised to delete"))
			}
		})
	})
}

function updateById(req, res) {

	// Get params
	let id = req.params.id || ''
	let newContent = req.body.content || ''

	// Check if ID exists
	if (id == '' || content == '') {
		res.status(400).json(new ApiResponse(400, "Provide the parameters: id, content"))
	}

	// Get token
	var token = req.get('Authorization') || ''
	var decodedUsername
	if (token != '') {
		decodedUsername = auth.decodeToken(token)
	}

	// Update Thread
	User.findOne({
		username: decodedUsername.sub
	}, {}, (err, u) => {
		Thread.findOne({
			_id: id,
			user: u._id
		}, {}, (err, t) => {
			if (t) {

				Thread.updateOne(t, {
					content: newContent
				}, (err) => {
					res.status(200).json(new ApiResponse(200, "deleted")).end()
				})
			} else {
				res.status(401).json(new ApiResponse(401, "Not Authorised to delete"))
			}
		})
	})
}

function getAll(req, res) {

	// get params
	let limit = req.query.limit || 25
	let title = req.query.title || ''

	// Get all Threads, standard limit 25
	Thread.find({
		title: new RegExp(title, "i")
	}, {
		_id: 0
	}).limit(limit).then((err, threads) => {
		res.status(200).json(new ApiResponse(200, threads)).end()
	})
}

module.exports = {
	getThreadById,
	getKarma,
	voteUp,
	voteDown,
	create,
	deleteById,
	updateById,
	getAll
}