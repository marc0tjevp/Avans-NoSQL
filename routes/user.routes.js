let routes = require('express').Router()
let user = require('../controller/user.controller')
let auth = require('../controller/auth.controller')

/**
 * Creates a user and driver
 * @route POST /users/register
 * @group User
 * @param {string} username.required - Username of the user
 * @param {string} password.required - Password of the user
 * @param {string} firsname.required - Firstname of the user
 * @param {string} lastname.required - Lastname of the user
 */
routes.post('/register', auth.register)

/**
 * Login to the API with username and password
 * @route POST /users/login
 * @group User
 * @param {string} username.required - Username of the user
 * @param {string} password.required - Password of the user
 */
routes.get('/login', auth.login)

/**
 * Gets user by username
 * @route GET /users/:username
 * @group User
 */
routes.get('/:username', user.GetByName)

/**
 * Gets all users
 * @route GET /users
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