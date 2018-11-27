const ApiResponse = require('../model/response/api.response')

function getByName (req,res){
	let username = req.params.username
	res.status(200).json(new ApiResponse(200, "Get User by name Endpoint")).end()
}

function update (req,res){
	res.status(200).json(new ApiResponse(200, "Update Endpoint")).end()
}

function getAll (req,res){
	res.status(200).end()
}

module.exports={getByName,update,getAll}