let routes = require('express').Router()
let friend = require('../controller/friend.controller')

/**
 * Login to the API with username and password
 * @route GET /friends/threads/:depth
 * @group Friendship
 * @param {int} depth.required - Depth of friends
 */
routes.get('/threads/:depth', friend.getThreadByDepth)

/**
 * Gets friends with a certain depth
 * @route GET /friends/:depth
 * @group Friendship
 * @param {int} depth.required - Username of the user
 */
routes.get('/:depth', friend.getByDepth)

/**
 * Adds a relation between two users
 * @route POST /friends
 * @group Friendship
 */
routes.post('*', friend.addFriend)

/**
 * Remove a relation between two users
 * @route DELETE /friends
 * @group Friendship
 */
routes.delete('*', friend.deleteByUsername)

/**
 * Gets all relations with a depth from the user
 * @route POST /friends
 * @group Friendship
 */
routes.get('*',friend.getAll)

module.exports = routes