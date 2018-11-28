var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId

var CommentSchema = new Schema({

  // Unique ID for a comment
  commentID: ObjectId,

  // Thread ID
  threadID: {
    type: ObjectId,
    ref: 'thread',
    required: false
  },

  // The inner content of the comment
  content: {
    type: String,
    required: true
  },
  
  // The User that made the comment
  user: {
    type: ObjectId,
    ref: 'user',
    required: true
  },

  // Array of comments on a comment
  comments: [this]

})

const Comment = mongoose.model('comment', CommentSchema)

module.exports = Comment