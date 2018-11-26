let routes = require('express').Router()
let auth = require('../controller/auth.controller')

/**
 * Login to the API with username and password
 * @route POST /auth/login
 * @group Authentication
 * @param {string} username.required - Username of the user
 * @param {string} password.required - Password of the user
 */
routes.get('/login', auth.login)

/**
 * Creates a user and driver
 * @route POST /auth/register
 * @group Authentication
 * @param {string} username.required - Username of the user
 * @param {string} password.required - Password of the user
 * @param {string} firsname.required - Firstname of the user
 * @param {string} lastname.required - Lastname of the user
 */
routes.get('/register', auth.register)

module.exports = routes