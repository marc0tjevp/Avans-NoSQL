let routes = require('express').Router()
let thread = require('../controller/thread.controller')
let comment = require('../controller/comment.controller')

/**
 * Gets a certain thread
 * @route GET /thread/:id
 * @group Thread
 * @param {int} id.required - id of the thread
 */
routes.get('/:id', thread.getThreadById)

/**
 * Adds a comment to the thread
 * @route POST /threads/:id/comments
 * @group Comment
 * @param {int} id.required - id of the thread
 * @param {string} content.required - content of the comment
 */
routes.post('/:id/comments', comment.create)

/**
 * Gets the comments associated with the given thread id
 * @route GET /threads/:id/comments
 * @group Comment
 * @param {int} id.required - id of the thread
 */
routes.get('/:id/comments', comment.getByThreadId)

/**
 * Gets the karma for a specific thread
 * @route POST /threads/:id/karma
 * @group Thread
 * @param {int} id.required - id of the thread
 */
routes.get('/:id/karma',thread.getKarma)

/**
 * Votes the thread up
 * @route POST /threads/:id/karma/up
 * @group Karma
 * @param {int} id.required - id of the thread
 */
routes.post('/:id/karma/up',thread.voteUp)

/**
 * Votes the thread down
 * @route POST /threads/:id/karma/down
 * @group Karma
 * @param {int} id.required - id of the thread
 */
routes.post('/:id/karma/down',thread.voteDown)

/**
 * Deletes a specific thread
 * @route DELETE /threads
 * @group Thread
 * @param {int} id.required - id of the thread
 */
routes.delete('/:id',thread.deleteById)

/**
 * Changes the content of a specific thread
 * @route PUT /threads/:id
 * @group Thread
 * @param {int} id.required - id of the thread
 */
routes.put('/:id',thread.updateById)

/**
 * Gets all threads
 * @route GET /threads
 * @group Thread
 * @param {int} limit - id of the thread
 * @param {string} title - id of the thread
 */
routes.get('*', thread.getAll)

/**
 * Creates a new thread
 * @route POST /threads
 * @group Thread
 * @param {string} content.required - content of the thread
 * @param {string} title.required - title of the thread
 */
routes.post('*', thread.create)

module.exports = routes