const ApiResponse = require('../model/response/api.response')
const neo = require('../neodb/neodbhelper')
const User = require('../model/schema/user.schema')
const Thread = require('../model/schema/thread.schema')
const Comment = require('../model/schema/comment.schema')

function getKarma(req, res) {
	//Get params
	let id = req.params.id || ''

	if(id == ''){
		res.status(400).json(new ApiResponse(400, "No id given"))
	}
	neodb.getThreadDownvotes(res, id ,(downVotes)=>{
		neodb.getThreadUpvotes(res,id ,(upVotes)=>{
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

	neodb.createCommentUpvote(res, decodedUsername.sub , id ,()=>{
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

	neodb.createCommentUpvote(res, decodedUsername.sub , id ,()=>{
		res.status(200).json(new ApiResponse(200, decodedUsername.sub+" upvoted the thread with id: " + id))
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
		Comment.findOne({commentID:id,user:u},{},(err,c)=>{
			if(t){
				Comment.UpdateOne(c,{content:newContent},(err)=>{
					res.status(200).json(new ApiResponse(200,"deleted")).end()
				})
			}
			res.status(401).json(new ApiResponse(401,"Not Authorised to delete"))
		})
	})
}

function getByThreadId(req, res) {
	//Get params
	let id = req.params.id || ''

	Thread.findOne({threadID: id},{comments:1,_id:0},(err,c)=>{
		res.status(200).json(new ApiResponse(200,c.comments)).end()
	})
}

function deleteById(req, res) {
	//Get params
	let id = req.params.id || ''

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''
	User.findOne({username:decodedUsername.sub},{},(err,u)=>{
		Comment.findOne({commentID:id,user:u},{},(err,c)=>{
			if(t){
				Comment.DeleteOne(c),(err)=>{
					if(err){
						res.status(401).json(new ApiResponse(401,"Not Authorised to delete"))
					}
					res.status(200).json(new ApiResponse(200,"deleted")).end()
				}
			}
		})
	})
}

function create(req, res) {
	//Get params
	let id = req.params.id || ''
	let content = req.body.content

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''
	User.findOne({username:decodedUsername.sub},{},(err,u)=>{
		Thread.findOne({threadID:id},{},(err,t)=>{
			var comment = new Comment({threadID:t,content:content,user:u})
			comment.save(function(err,c){
				neodb.saveComment(res,c.commentID,()=>{
					res.status(200).json(new ApiResponse(200,c)).end()
				})
			})
		})
	})
}

function addTo(req, res) {
	//Get params
	let id = req.params.id || ''
	let content = req.body.content

	//Get token
	var token = req.get('Authoriziation') || ''
	var decodedUsername = auth.decodeToken(token) || ''
	User.findOne({username:decodedUsername.sub},{},(err,u)=>{
		var comment = new Comment({content:content,user:u})
		comment.save(function(err,c){
			Comment.update({commentID:id},{comments:comments.concat([comment])},(err)=>{
				neodb.saveComment(res,comment.commentID,()=>{
					res.status(200).json(new ApiResponse(200,c)).end()
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