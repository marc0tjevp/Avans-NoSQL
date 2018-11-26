const ApiResponse = require('../model/api.response')

function login(req, res) {

    // Get parameters from body
    let username = req.body.username || ''
    let password = req.body.password || ''

    res.status(200).json(new ApiResponse(200, "Login Endpoint")).end()

}

function register(req, res) {

    // Get parameters from body
    let username = req.body.username || ''
    let password = req.body.password || ''

    res.status(200).json(new ApiResponse(200, "Register Endpoint")).end()

}

module.exports = {
    login,
    register
}