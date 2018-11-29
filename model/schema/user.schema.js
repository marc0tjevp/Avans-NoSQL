var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var userSchema = new Schema({

    // Username of a user, unique key
    username: {
        type: String,
        required: true,
        unique: true,
    },

    // Password of the user
    password: {
        type: String,
        required: true
    }

})

const User = mongoose.model('user', userSchema)

module.exports = User