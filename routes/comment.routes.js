let routes = require('express').Router()
let comment = require('../controller/comment.controller')

/**
 * Gets up/downvotes from a certain comment
 * @route GET /comments/:id/karma
 * @group Comment
 * @param {int} id.required - id of comment
 */
routes.get('/karma', comment.getKarma)

/**
 * Votes the comment up
 * @route POST /comments/:id/karma/up
 * @group Karma
 * @param {int} id.required - id of comment
 */
routes.post('/karma/up', comment.voteUp)

/**
 * Votes the comment down
 * @route POST /comments/:id/karma/down
 * @group Karma
 * @param {int} id.required - id of comment
 */
routes.post('/karma/down', comment.voteDown)

/**
 * Deletes the comment
 * @route POST /comments/:id
 * @group Comment
 * @param {int} id.required - id of comment
 */
routes.delete('*', comment.deleteById)

/**
 * Updates a comment with content
 * @route PUT /comments/:id
 * @group Comment
 * @param {int} id.required - id of comment
 * @param {string} content.required - content of the comment
 */
routes.put('*',comment.updateById)

/**
 * Creates a new comment
 * @route POST /comments/:id
 * @group Comment
 * @param {int} id.required - id of comment
 * @param {string} content.required - content of the comment
 */
routes.post('*',comment.addTo)

module.exports = routes