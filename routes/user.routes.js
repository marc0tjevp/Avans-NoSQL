let routes = require('express').Router()
let user = require('../controller/user.controller')
let auth = require('../controller/auth.controller')

/**
 * Creates a new user
 * @route POST /users/register
 * @group User
 * @param {string} username.required - Username of user
 * @param {string} password.required - Password of user
 */
routes.post('/register', auth.register)

/**
 * Logs a user in
 * @route POST /users/login
 * @group User
 * @param {string} username.required - Username of user
 * @param {string} password.required - Password of user
 */
routes.post('/login', auth.login)

/**
 * Gets all information from a user
 * @route GET /users/:username
 * @group User
 * @param {string} username.required - Username of user
 */
routes.get('/:username', user.getByName)

/**
 * Updates a users password
 * @route PUT /users
 * @group User
 * @param {string} username.required - Username of user
 * @param {string} oldPassword.required - Old password of user
 * @param {string} newPassword.required - New password of user
 */
routes.put('*', user.update)

/**
 * Gets all users
 * @route GET /users
 * @group User
 */
routes.get('*', user.getAll)

module.exports = routes