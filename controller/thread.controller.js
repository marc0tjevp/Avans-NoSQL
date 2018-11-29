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
	neodb.getThreadDownvotes(res,{ threadId: id },(downVotes)=>{
		neodb.getThreadUpvotes(res,{ threadId: id },(upVotes)=>{
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

	neodb.createThreadUpvote(res,{ username: decodedUsername.sub },{ threadId: id },()=>{
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

	neodb.createThreadDownvote(res,{ username: decodedUsername.sub },{ threadId: id },()=>{
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
	User.findOne({username:decodedUsername.sub},{},(err,u)=>{
		Thread.findOne({threadID:id,user:u},{},(err,t)=>{
			if(t){
				Thread.deleteOne(t,(err)=>{
					res.status(200).json(new ApiResponse(200,"deleted")).end()
				})
			}
			res.status(401).json(new ApiResponse(401,"Not Authorised to delete"))
		})
	})
}

function updateById(req, res) {
	//Get params
	let id = req.params.id || ''
	let newContent = req.body.content || ''

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''
	User.findOne({username:decodedUsername.sub},{},(err,u)=>{
		Thread.findOne({threadID:id,user:u},{},(err,t)=>{
			if(t){
				Thread.UpdateOne(t,{content:newContent},(err)=>{
					res.status(200).json(new ApiResponse(200,"deleted")).end()
				})
			}
			res.status(401).json(new ApiResponse(401,"Not Authorised to delete"))
		})
	})
}

function getAll(req, res) {
	//get params
	let limit = req.query.limit || 100
	let title = req.query.title || ''
	 
	Thread.find({title:new RegExp(title,"i")},{_id:0}).limit(limit).then((err,threads)=>{
		res.status(200).json(new ApiResponse(200,threads)).end()
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