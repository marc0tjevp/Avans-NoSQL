const express = require('express')
const bodyParser = require('body-parser')
const boxen = require('boxen');
var morgan = require('morgan')
const app = express()

// Config
const swaggerOptions = require('./config/swagger.config.json')
const config = require('./config/config.json')

// Responses
const NotFoundResponse = require('./model/response/notfound.response')
const ApiResponse = require('./model/response/api.response')

// Startup log
console.log(boxen('Studdit API', {padding: { left: 20, right: 20, top: 1, bottom: 1 }, margin: 1, borderStyle: 'double'}));

// Mongoose
var mongoose = require('mongoose')
mongoose.connect(config.databases.mongo, { useNewUrlParser: true })
var db = mongoose.connection

db.on('error', console.error.bind(console, 'Could not connect to ' + config.databases.mongo + ": "))

db.once('open', function() {
  console.log('Mongoose: Connected to Mongo Database: ' + config.databases.mongo)
})

// Swagger
const expressSwagger = require('express-swagger-generator')(app);
expressSwagger(swaggerOptions)

// Use
app.use(bodyParser.json())
app.use(morgan(':method :url :status :response-time ms - :res[content-length]'))

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
var server = app.listen(process.env.PORT || config.port, function () {
    var host = server.address().address
    var port = server.address().port

    console.log("Express: Listening to Socket: http://localhost/" + port)
})
