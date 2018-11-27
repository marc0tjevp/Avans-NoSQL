const ApiResponse = require('../model/response/api.response')

function getThreadById (req,res){
	res.status(200).json(new ApiResponse(200, "Get Thread by Id Endpoint")).end()
}

function getKarma (req,res){
	res.status(200).end()
}

function voteUp (req,res){
	res.status(200).end()
}

function voteDown (req,res){
	res.status(200).end()
}

function create (req,res){
	res.status(200).end()
}

function deleteById (req,res){
	res.status(200).end()
}

function updateById (req,res){
	res.status(200).end()
}

function getAll (req,res){
	res.status(200).json(new ApiResponse(200, "Get All Threads Endpoint")).end()
}

module.exports={getThreadById,getKarma,voteUp,voteDown,create,deleteById,updateById,getAll}