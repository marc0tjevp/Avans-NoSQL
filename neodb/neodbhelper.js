const server = require('../config/config.json').databases.neo4j
const db = require('seraph')(server)
const body = require('body-parser')
const Friend = "knows"
const UpVote = "upvoted"
const DownVote = "downvoted"

//Save objects
function saveUser(res,user,next){
	db.save({username:user},'user',(err,user)=>{
		if (err) {
			onErr(res,err)
		}
		next(user)
	})
}

function saveThread(res,thread,next){
	db.save({threadId: thread},'thread',(err,thread)=>{
		if (err) {
			onErr(res,err)
		}
		next(thread)
	})
}

function saveComment(res,comment,next){
	db.save({commentId:comment},'comment',(err,com)=>{
		if (err) {
			onErr(res,err)
		}
		next(com)
	})
}

//create relationships
function createFriendship(res,user1,user2,next){
	db.find({username:user1},(err,u1)=>{
		
		db.find({username:user2},(err,u2)=>{
			getFriendships(res,user1,1,(friend1)=>{
				
				if(friend1.some((value,index,array)=>{return value==user2})){
					getFriendships(res,user2,1,(friend2)=>{
				
						if(friend2.some((value,index,array)=>{return value==user1})){
							db.relate(u1,Friend,u2,(err,rel)=>{
					
								next("Friendship added")
							})
						}else{
							next("Friendship already exists")
						}
					})
				}else{
					next("Friendship already exists")
				}
			})
		})
		
	})
}

function createThreadUpvote(res,user,thread,next){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',DownVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				
				db.delete(vote,(err)=>{
					if(err){
						onErr(res,err)
					}
				})
			}
		})
		db.find({threadId:thread.threadId},(err,t)=>{
			db.relate(u,"upvoted",t,(err,rel)=>{
				if(err){
					onErr(res,err)
				}
				next({"info":"user upvoted"})
			})
		})
	})
}
	
function createThreadDownvote(res,user,thread,next){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',UpVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				
				db.delete(vote,(err)=>{
					if(err){
						onErr(res,err)
					}
				})
			}
		})
		db.find({threadId:thread},(err,t)=>{
			if (err){
				onErr(res,err)
			}
			db.relate(u,DownVote,t,(err,rel)=>{
				next(rel)
			})
			
		})
	})
}

function createCommentUpvote(res,user,comment,next){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',DownVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				
				db.delete(vote,(err)=>{
					if(err){
						onErr(res,err)
					}
				})
			}
		})
		db.find({commentId:commentId},(err,t)=>{
			db.relate(u,"upvoted",t,(err,rel)=>{
				if(err){
					onErr(res,err)
				}
				next({"info":"user upvoted"})
			})
		})
	})
}
	
function createCommentDownvote(res,user,comment,next){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',UpVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				
				db.delete(vote,(err)=>{
					if(err){
						onErr(res,err)
					}
				})
			}
		})
		db.find({commentId:comment},(err,t)=>{
			if (err){
				onErr(res,err)
			}
			db.relate(u,DownVote,t,(err,rel)=>{
				next(rel)
			})
			
		})
	})
}
	
//get relationships
	
function getFriendships(res,user,depth,next){
	depth++
	db.find({username:user},(err,users)=>{
		if(err){
			onErr(res,err)
		}
		var u = users
		var friends = []
		friends = friends.concat(u)
		for(i=0;i<depth;i++){
			friends.forEach((friend)=>{
				db.relationships(friend,'all',Friend,(err,rels)=>{
					var itemsleft = rels.length
					rels.forEach((rel)=>{
							if(rel){
								db.read(rel.start,(err,found)=>{
									db.read(rel.end,(err,found1)=>{
										friends = friends.concat([found,found1])
										var list = []
										const map = new Map();
										for (const item of friends) {
    										if(!map.has(item.username)){
        										map.set(item.username, true);    // set any value to Map
        										list.push({
            										username: item.username
												});
											}
										}
										friends = list
										
										if(itemsleft==1&&depth-i==0){
											next(friends)
											i++
										}else{
											itemsleft--
										}
									})
									
								})
								}
							})
							
						})
					})
				}
	})
}
	
function getThreadUpvotes(res,threadId,next){
	db.find({threadId:threadId},(err,t)=>{
		if (err){
			onErr(res,err)
		}
		
		db.relationships(t[0],'all',UpVote,(err,rel)=>{
			next(rel.length)
		})
	})
}
	
function getCommentDownvotes(res,commentId,next){
	db.find({commentId:commentId},(err,t)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(t,'all',DownVote,(err,rel)=>{
			if (err){
				onErr(res,err)
			}
			next(rel.length)
		})
	})
}

function getCommentUpvotes(res,commentId,next){
	db.find({commentId:commentId},(err,t)=>{
		if (err){
			onErr(res,err)
		}
		
		db.relationships(t[0],'all',UpVote,(err,rel)=>{
			next(rel.length)
		})
	})
}

function getThreadUpvotes(res,threadId,next){
	db.find({threadId:threadId},(err,t)=>{

		if (err){
			onErr(res,err)
		}
		db.relationships(t,'all',UpVote,(err,rel)=>{
			if (err){
				onErr(res,err)
			}
			next(rel.length)
		})
	})
}
	
function getThreadDownvotes(res,threadId,next){
	db.find({threadId:threadId},(err,t)=>{

		if (err){
			onErr(res,err)
		}
		db.relationships(t,'all',DownVote,(err,rel)=>{
			if (err){
				onErr(res,err)
			}
			next(rel.length)
		})
	})
}
	
//deletes relationships
function deleteFriendship(res,user1,user2,next){
	db.find({username:user1.username},(err,u1)=>{
		if (err){
			onErr(res,err)
		}
		db.find({username:user2.username},(err,u2)=>{
			if (err){
				onErr(res,err)
			}
			db.relationships(u1,'all',Friend,(err,rel)=>{
				if (err){
					onErr(res,err)
				}
				rel.forEach((r)=>{
					db.read(r,(err,rr)=>{
						if(err){
							onErr(res,err)
						}
						if((rr.start==u1&&rr.end==u2)||(rr.start==u2&&rr.end==u1)){
							db.delete(rr,(err,ret)=>{
								if(err){
									onErr(res,err)
								}
							})
						next({"info":"Friendship deleted"})
						}
					})
				})
				next({"info":"Friendship deleted (not found)"})
			})
		})
	})
}
	
//Error function
function onErr(res,err){
	res.status(500).json(err).end()
}

module.exports={saveUser,saveComment,saveThread,
	createThreadDownvote,createThreadUpvote,createFriendship,
	createCommentDownvote,createCommentUpvote,
	getThreadDownvotes,getThreadUpvotes,getFriendships,
	getCommentUpvotes,getCommentDownvotes,
	deleteFriendship}