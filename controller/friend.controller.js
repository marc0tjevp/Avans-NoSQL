const ApiResponse = require('../model/response/api.response')
const neo = require('../neodb/seraphhelper')

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
	getFriendships(username, depth, (err,rels) => {
		if(err){
			res.status(500).json(new ApiResponse(500,"Something went wrong, please contact the owners")).end()
		} else{
			res.status(200).json(new ApiResponse(200, rels)).end()
		}
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
	neo.saveRel({username:user1},"knows",{username:user2},null,(err,data) => {
		if(err){
			res.status(500).json(new ApiResponse(500,"Something went wrong, please contact the owners"))
		} else{
			res.status(200).json(new ApiResponse(200, data)).end()
		}
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
	neo.deleteRel({username: user1},{username:user2},(err,data)=>{
		if(err){
			res.status(500).json(new ApiResponse(500,"Something went wrong, please contact the owners"))
		} else{
			res.status(200).json(new ApiResponse(200, data)).end()
		}
	})

}

function getAll(req, res) {

	let username = req.params.username || ''

	// Check if username is present (should never trigger because it is required in routing)
	if (username == '') {
		res.status(412).json(new ApiResponse(412, "Please provide query parameter: username")).end()
	}

	// Get all friends
	getFriendships(username, 1, (err,friends) => {
		if(err){
			res.status(500).json(new ApiResponse(500,"Something went wrong, please contact the owners")).end()
		} else{
			res.status(200).json(new ApiResponse(200, friends)).end()
		}
	})

}

function getFriendships(user,depth,next){
	depth++
	neo.getAllRels({username:user},"knows",(err,rels) => {
		if(err){
			next(err,null)
		} else{
			var friends = []
			for(i=0;i<depth;i++){
				friends.forEach((friend)=>{
					neo.getAllRels(friend,"knows",(err,rels)=>{
						var itemsleft = rels.length
						rels.forEach((rel)=>{
							if(rel){
								neo.getNode(rel.start,(err,found)=>{
									neo.getNode(rel.end,(err,found1)=>{
										var list = []
										const map = new Map()
										for (const item of friends){
											if(!map.has(item.username)){
												map.set(item.username, true)
												list.push({
													username: item.username
												})
											}
										}
										friends = list

										if(itemsleft==1&&depth-i==0){
											next(friends)
											i++
										}
									})
								})
							}
						})
					})
				})
			}
		}
		
	})
}
module.exports = {
	getThreadByDepth,
	getByDepth,
	addFriend,
	deleteByUsername,
	getAll
}