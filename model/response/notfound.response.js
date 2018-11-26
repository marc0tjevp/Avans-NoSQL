class NotFoundResponse {

    constructor(endpoint) {
        this.status = 404
        this.endpoint = endpoint
        this.message = "This endpoint could not be found"
        this.datetime = new Date().toISOString()
    }

}

module.exports = NotFoundResponse