let routes = require('express').Router()
let thread = require('../controller/thread.controller')
let comment_route = require('./comment.routes')

routes.get('/:threadId', thread.getThreadById)

routes.use('/:threadId/comments', comment_route)

routes.get('/:threadId/karma',thread.getKarma)

routes.post('/:threadId/karma/up',thread.voteUp)

routes.post('/:threadId/karma/down',thread.voteDown)

routes.get('*', thread.getAll)

routes.post('*', thread.create)

routes.delete('/:threadId',thread.deleteById)

routes.put('/:threadId',thread.updateById)

module.exports = routes