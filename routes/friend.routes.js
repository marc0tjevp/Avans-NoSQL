let routes = require('express').Router()
let friend = require('../controller/friend.controller')

routes.get('/threads/:depth', friend.getThreadByDepth)

routes.get('/:depth', friend.getByDepth)

routes.post('*', friend.addFriend)

routes.delete('*', friend.deleteByUsername)

routes.get('*',friend.getAll)

module.exports = routes