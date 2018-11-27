let routes = require('express').Router()
let user = require('../controller/user.controller')
let auth = require('../controller/auth.controller')

/**
 * Creates a new user
 * @route POST /users/register
 * @group User
 */
routes.post('/register', auth.register)

/**
 * Logs a user in
 * @route POST /users/login
 * @group User
 */
routes.post('/login', auth.login)

/**
 * Gets all information from a user
 * @route GET /users/:username
 * @group User
 */
routes.get('/:username', user.getByName)

/**
 * Updates a users password
 * @route PUT /users
 * @group User
 */
routes.put('*',user.update)

/**
 * Gets all users
 * @route GET /users
 * @group User
 */
routes.get('*', user.getAll)

module.exports = routes