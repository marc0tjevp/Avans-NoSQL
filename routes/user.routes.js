let routes = require('express').Router()
let user = require('../controller/user.controller')
let auth = require('../controller/auth.controller')

routes.post('/register', auth.register)

routes.get('/login', auth.login)

routes.get('/:username', user.getByName)

routes.put('*',user.update)

routes.get('*', user.getAll)

module.exports = routes