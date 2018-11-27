let routes = require('express').Router()
let thread = require('../controller/thread.controller')
let comment = require('../controller/comment.controller')

/**
 * Gets a certain thread
 * @route GET /thread/:id
 * @group Thread
 */
routes.get('/:id', thread.getThreadById)

/**
 * Adds a comment to the thread
 * @route POST /threads/:id/comments
 * @group Comment
 */
routes.post('/:id/comments', comment.create)

/**
 * Gets the comments associated with the given thread id
 * @route GET /threads/:id/comments
 * @group Comment
 */
routes.get('/:id/comments', comment.getByThreadId)

/**
 * Gets the karma for a specific thread
 * @route POST /threads/:id/karma
 * @group Thread
 */
routes.get('/:id/karma',thread.getKarma)

/**
 * Votes the thread up
 * @route POST /threads/:id/karma/up
 * @group Karma
 */
routes.post('/:id/karma/up',thread.voteUp)

/**
 * Votes the thread down
 * @route POST /threads/:id/karma/down
 * @group Karma
 */
routes.post('/:id/karma/down',thread.voteDown)

/**
 * Gets all threads
 * @route GET /threads
 * @group Thread
 */
routes.get('*', thread.getAll)

/**
 * Creates a new thread
 * @route POST /threads
 * @group Thread
 */
routes.post('*', thread.create)

/**
 * Deletes a specific thread
 * @route DELETE /threads
 * @group Thread
 */
routes.delete('/:id',thread.deleteById)

/**
 * Changes the content of a specific thread
 * @route PUT /threads/:id
 * @group Thread
 */
routes.put('/:id',thread.updateById)

module.exports = routes