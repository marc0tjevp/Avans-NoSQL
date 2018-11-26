// Require
const express = require('express')
const bodyParser = require('body-parser')
const NotFoundResponse = require('./model/notfound.response')
const app = express()
const port = 3000

// Swagger
const expressSwagger = require('express-swagger-generator')(app);
const swaggerOptions = require('./config/swagger.config.json')
expressSwagger(swaggerOptions)

// Use
app.use(bodyParser.json())

// Route files
const auth_routes = require('./routes/auth.routes')

// Routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/auth', auth_routes)

// Catch 404's
app.use('*', function (req, res) {
    res.status('404').json(new NotFoundResponse(req.originalUrl)).end()
})

// Listen on port
var server = app.listen(process.env.PORT || 8080, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Listening on port " + port)
})