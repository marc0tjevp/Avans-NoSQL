const server = require('../config/config.json').databases.neo4j
const db = require('seraph')(server)

//Save Objects using item as object, label as string and next as function
/// saveNode saves a node in the Neo server defined in config.json
// item is the object to be saved as a node in the server
// label is the optional string to be seen as a label to the node.
// next is the callback function with err = error and done = the node.
///
function saveNode(item, label=null, next){
	db.find(item,(err,i)=>{
		if(err){
			console.log("error: "+err)
			next(err)
		} else if(i){
			if(i.some((value)=>{return value==item})){
				console.log(i)
				next({err:"It already Exists"})
			} else{
				if(label !=null){
					db.save(item,label,(err,done)=>{next(err,done)})
				} else{
					db.save(item,(err,done)=>{next(err,done)})
				}
			}
		} else {
			next("Error")
		}
	})
}

/// saveRel saves a relationship between two already existing nodes
// preItem1 is an object with data from the node,
// preItem2 is an object with data from the node,
// type is the name of the type of relationship
// properties are the properties that are related to the relationship
// next is the callback function with err = error and done = the node.
///
function saveRel(preItem1,type,preItem2,properties,next){
	getAllRels(preItem1,(rels)=>{
		getNode(preItem2,(i1)=>{
			var hasItem = rels.some((rel,index,array)=>{
				if(rel.start==i1.id||rel.end==i1.id){
					return true
				}
			})
			if(hasItem){
				var err = {err:"Err: Relationship already exists"}
				console.log(err)
				next(err,null)
			} else {
				getNode(preItem1,(i2)=>{
					db.create(i2,type,i1,properties,(err,rel)=>{
						next(null,rel)
					})
				})
			}
		})
	})
}

/// getNodeByLabel gets all nodes with a certain label
// label is the string set as label for the nodes to be searched for
// next is the callback function with err = error and nodes = the nodes with the given label.
///
function getNodeByLabel(label,next){
	db.nodeWithLabel(label,(err,nodes)=>{
		next(err,nodes)
	})
}

/// getAllRels get all relationships with an existing node
// preItem is an object with data from the node,
// type is a string with the type of relationship,
// next is the callback function with err = error and done = the relationships.
///
function getAllRels(preItem,type='',next){
	getNode(preItem,(i)=>{
		db.relationships(i,'all',type,(err,rels)=>{
			next(err,rels);
			return;
		})
	})
}

/// getNode gets a specific node
// preItem is an object with data from the node,
// next is the callback function with err = error and done = the node.
///
function getNode(preItem,next){
	db.find(preItem,(err,i)=>{
		if(err){
			next(err,null)
		} else{
			next(null,i)
		}
	})
}

/// getRel gets a specific relationship between two nodes
// preItem1 is an object with data from the node,
// preItem2 is an object with data from the node,
// next is the callback function with err = error and done = the relationship.
///
function getRel(preItem1,preItem2,next){
	getNode(preItem1,(i1)=>{
		getAllRels(preItem2,(err,rels)=>{
			var rel=null;
			if(!rels){
				next("none found")
			} else{ if(rels){
				next(err,null)
			} else { 
				if(rels.some((value,index,array)=>{
				if(value.start==i1.id||value.end==i1.id){
					rel = value
					return true;
				}else{
					return false;
				}
			})){
				next(null,rel)
			} else{
				next('none found',null)
			}
		}
		}
		})
	})
}

/// deleteRel deletes a specific relationship between two nodes
// preItem1 is an object with data from the node,
// preItem2 is an object with data from the node,
// next is the callback function with the return value being true, if it was deleted, or false if it failed
///
function deleteRel(preItem1,preItem2,next){
	getRel(preItem1,preItem2,(err,rel)=>{
		if(rel){
			db.delete(rel,(err)=>{
				if(err){
					next(false)
				} else{
					next(true)
				}
			})
		} else {
			next(false)
		}
	})
}

/// deleteRel deletes a specific node with all relationships along with it
// preItem is an object with data from the node,
// next is the callback function with the return value being true, if it was deleted, or false if it failed
///
function deleteNode(preItem,next){
	getNode(preItem,(err,node) => {
		if(err) {
			next(false)
		} else {
			db.delete(node,true,(err)=>{
				if(err){
					next(false)
				} else{
					next(true)
				}
			})
		}
			
	})
}

module.exports = {
	saveNode, saveRel,
	getAllRels, getNode,
	getNodeByLabel, getRel,
	deleteRel, deleteNode
};
