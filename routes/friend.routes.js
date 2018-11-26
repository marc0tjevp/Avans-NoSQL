let routes = require('express').Router()
let friend = require('../controller/friend.controller')

/**
 * Gets all threads from friends with a given depth. Example: depth = 1 returns threads from direct friends
 * @route GET /friends/threads/:depth
 * @group Friendship
 */
routes.get('/threads/:depth', friend.getThreadByDepth)

/**
 * Gets all friends with a given depth. Example: depth = 1 returns direct friends
 * @route GET /friends/threads/:depth
 * @group Friendship
 */
routes.get('/:depth', friend.getByDepth)

/**
 * Adds a friend to the current user
 * @route POST /friends
 * @group Friendship
 * @param {string} username.required - Username of friend
 */
routes.POST('*', friend.AddFriend)

/**
 * Creates a user and driver
 * @route DELETE /friends/:username
 * @group Friendship
 */
routes.delete('*', friend.deleteByUsername)

/**
 * Gets all friends for the logged in user
 * @route GET /friends
 * @group Friendship
 */
routes.get('*',friend.getAll)

module.exports = routes