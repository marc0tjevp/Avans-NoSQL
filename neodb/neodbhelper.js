const server = require('../config/config.json').databases.neo4j
const db = require('seraph')(server)
const Friend = "knows"
const UpVote = "upvoted"
const DownVote = "downvoted"

//Save objects
function saveUser(res,user,next=()=>{}){
	db.save(user,'user',(err,user)=>{
		if (err) {
			onErr(res,err)
		}
		next(user)
	})
}

function saveThread(res,thread,next=()=>{}){
	db.save(thread,'thread',(err,thread)=>{
		if (err) {
			onErr(res,err)
		}
		next(thread)
	})
}

function saveComment(res,comment,next=()=>{}){
	db.save(comment,'comment',(err,com)=>{
		if (err) {
			onErr(res,err)
		}
		next(com)
	})
}

//create relationships
function createFriendship(res,user1,user2,next=()=>{}){
	db.find({username:user1},(err,u1)=>{
		if (err) {
			onErr(res,err)
		}
		db.find({username:user2},(err,u2)=>{
			if(err){
				onErr(res,err)
			}
			db.relationships(u1,'out',Friend,(err,rels)=>{
				if (err){
				onErr(res,err)
				}
				rels.forEach((r)=>{
					db.read(r,(err,rr)=>{
						if(err){
							onErr(res,err)
						}
						if((rr.start==u1&&rr.end==u2)||(rr.start==u2&&rr.end==u1)){
							next({"info":"Friendship already Exists"})
						}
					})
				})
				db.relate(u1,Friend,u2,(err,rel)=>{
					if(err){
						onErr(res,err)
					}
					next({"info":"Friendship added"})
				})
				
			})
		})
		
	})
}

function createThreadUpvote(res,user,thread,next=()=>{}){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',DownVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				Console.log("Downvote found, deleting")
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
	
function createThreadDownvote(res,user,thread,next=()=>{}){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',UpVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				Console.log("Upvote found, deleting")
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

function createCommentUpvote(res,user,comment,next=()=>{}){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',DownVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				Console.log("Downvote found, deleting")
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
	
function createCommentDownvote(res,user,comment,next=()=>{}){
	db.find({username:user},(err,u)=>{
		if (err){
			onErr(res,err)
		}
		db.relationships(u,'out',UpVote,(err,vote)=>{
			if(err){
				onErr(res,err)
			}
			if(vote){
				Console.log("Upvote found, deleting")
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
	
function getFriendships(res,user,depth,next=()=>{}){
	db.find({username:user},(err,users)=>{
		if(err){
			onErr(res,err)
		}
		var friends = []
		var u = users[0]
		friends.concat([u])
		for(i = 0;i<depth;i++){
			var frnds = []
			friends.forEach((friend)=>{
				db.relationships(friend,'all',Friend,(err,rels)=>{
					if(err){
						onErr(res,err)
					}
					rels.forEach((rel)=>{
						db.read(rel,(err,r)=>{
							if(err){
								onErr(res,err)
							}
							frnds.concat([r.start,r.end]).unique
						})
					})
				})
			})
			friends=frnds
		}
			next(friends.unique)
		})
}
	
function getThreadUpvotes(res,threadId,next=()=>{}){
	db.find({threadId:threadId},(err,t)=>{
		if (err){
			onErr(res,err)
		}
		
		db.relationships(t[0],'all',UpVote,(err,rel)=>{
			next(rel.length)
		})
	})
}
	
function getCommentDownvotes(res,commentId,next=()=>{}){
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

function getCommentUpvotes(res,commentId,next=()=>{}){
	db.find({commentId:commentId},(err,t)=>{
		if (err){
			onErr(res,err)
		}
		
		db.relationships(t[0],'all',UpVote,(err,rel)=>{
			next(rel.length)
		})
	})
}
	
function getThreadDownvotes(res,commentId,next=()=>{}){
	db.find({threadId:threadÍd},(err,t)=>{

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
function deleteFriendship(res,user1,user2,next=()=>{}){
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
	getCommentDownvotes,getCommentUpvotes,
	deleteFriendship}