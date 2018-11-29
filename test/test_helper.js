const mongoose = require('mongoose')
mongoose.Promise = global.Promise

before((done) => {


    mongoose.connect('mongodb://localhost/studdit_test', {useNewUrlParser: true})

    mongoose.connection
        .once('open', () => {
            done()
        })
        .on('error', (error) => {
            console.warn('Warning:', error)
            done()
        })
})

beforeEach((done) => {
    mongoose.connection.collections.threads.drop(() => {
        mongoose.connection.collections.comments.drop(() => {
            mongoose.connection.collections.users.drop(() => {
                done()
            })
        })
    })
})