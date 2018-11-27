let routes = require('express').Router()
let comment = require('../controller/comment.controller')

routes.get('/:id/karma', comment.getKarma)

routes.post('/:id/karma/up', comment.voteUp)

routes.post('/:id/karma/down', comment.voteDown)

routes.delete('/:id', comment.deleteById)

routes.put('/:id',comment.updateById)

routes.get('*', comment.getByThreadId)

routes.post('*', comment.create)

module.exports = routes