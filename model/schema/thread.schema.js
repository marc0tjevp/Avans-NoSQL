  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  const ObjectId = mongoose.Schema.Types.ObjectId
  
  const Comment = require('./comment.schema.js')

  var threadSchema = new Schema({

    // Unique ID for a thread
    threadID: ObjectId,

    // The User that made the thread
    user: {
      type: ObjectId,
      ref: 'user',
      required: true
    },

    // Thread title
    title: {
      type: String,
      required: true
    },

    // The inner text of the thread
    content: {
      type: String,
      required: true
    },

    // List with comments on the thread
     comments: [Comment.CommentSchema]
    
  })

  const Thread = mongoose.model('thread', threadSchema)

  module.exports = Thread