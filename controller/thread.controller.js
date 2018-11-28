const ApiResponse = require('../model/response/api.response')
const User = require('../model/schema/user.schema')
const Thread = require('../model/schema/thread.schema')
const auth = require('../config/authentication.config')
const neodb = require('../neodb/neodbhelper')

function getThreadById(req, res) {
	
	//Get params
	let threadId = req.params.id || ''

	Thread.findOne({ threadID: threadId },{ comments: 0 },
		function(err, thread){
			res.status(200).json(new ApiResponse(200,thread))
		}
	)
	
	res.status(200).json(new ApiResponse(200, "Get Thread by Id Endpoint")).end()
}

function getKarma(req, res) {

	//Get params
	let id = req.params.id || ''

	if(id == ''){
		res.status(400).json(new ApiResponse(400, "No threadId given"))
	}
	neodb.getDownvotes(res,{ threadId: id },(downVotes)=>{
		neodb.getUpvotes(res,{ threadId: id },(upVotes)=>{
			res.status(200).json(new ApiResponse(200,"Karma = " + upVotes + "  - " + downVotes + " = " + (upVotes - downVotes)))
		})
	})
}

function voteUp(req, res) {

	//Get params
	let id = req.params.id || ''

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''

	if(id == ''){
		res.status(400).json(new ApiResponse(400, "No threadId given"))
	}

	neodb.createUpvote(res,{ username: decodedUsername.sub },{ threadId: id },()=>{
		res.status(200).json(new ApiResponse(200, decodedUsername.sub+" upvoted the thread with id: " + id))
	})
}

function voteDown(req, res) {

	//Get params
	let id = req.params.id || ''

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''

	if(id == ''){
		res.status(400).json(new ApiResponse(400, "No threadId given"))
	}

	neodb.createDownvote(res,{ username: decodedUsername.sub },{ threadId: id },()=>{
		res.status(200).json(new ApiResponse(200, decodedUsername.sub+" downvoted the thread with id: " + id))
	})
}

function create(req, res) {
	
	//Get params
	let t = req.body.title || ''
	let con = req.body.content || ''

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''

	User.findOne({ username: decodedUsername.sub },{_id:0},
		function(err, u){
			var thread = new Thread({
				user: u,
				title: t,
				content: con
			})
			thread.save(function(err,t){
				res.status(200).json(new ApiResponse(200,t)).end()
			})
		}
	)
}

function deleteById(req, res) {
	
	//Get params
	let id = req.params.id || ''

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''

	Thread.findOne({threadID:id},{},(err,t)=>{
		User.findOne({username:decodedUsername.sub},{},(err,u)=>{
			if(t.user==u){
				Thread.deleteOne(t,(err)=>{
					res.status(200).json(new ApiResponse(200,"deleted")).end()
				})
			}
		})
	})
}

function updateById(req, res) {
	res.status(200).end()
}

function getAll(req, res) {
	res.status(200).json(new ApiResponse(200, "Get All Threads Endpoint")).end()
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