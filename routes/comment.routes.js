let routes = require('express').Router()
let comment = require('../controller/comment.controller')

/**
 * Gets up/downvotes from a certain comment
 * @route GET /comments/:id/karma
 * @group Comment
 */
routes.get('/:id/karma', comment.getKarma)

/**
 * Votes the comment up
 * @route POST /comments/:id/karma/up
 * @group Karma
 */
routes.post('/:id/karma/up', comment.voteUp)

/**
 * Votes the comment down
 * @route POST /comments/:id/karma/down
 * @group Karma
 */
routes.post('/:id/karma/down', comment.voteDown)

/**
 * Deletes the comment
 * @route POST /comments/:id
 * @group Comment
 */
routes.delete('/:id', comment.deleteById)

/**
 * Updates a comment with comment
 * @route PUT /comments/:id
 * @group Comment
 */
routes.put('/:id',comment.updateById)



module.exports = routes