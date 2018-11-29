const assert = require('assert')
const request = require('supertest')
const chai = require('chai')
const mongoose = require('mongoose')
const User = require('../model/schema/user.schema')
const Thread = require('../model/schema/thread.schema')
const Comment = require('../model/schema/comment.schema')
const auth = require('../config/authentication.config')

const server = require('../server').app
var chaiHttp = require('chai-http')
chai.use(chaiHttp)
chai.should()

describe('Comments', () => {

    it('Should create a comment on a thread', done => {

        const user = new User({
            "username": "Marco",
            "password": "Test123"
        })
        
        const thread = new Thread({
            user: user._id,
            content: "SomeContent",
            title: "TestTitle"
        })

        const token = auth.encodeToken("Marco")

        user.save().then(() => {
            thread.save().then(() => {
                chai.request(server)
                    .post('/threads/' + thread._id + '/comments')
                    .set('Authorization', token)
                    .send({
                        threadID: thread._id,
                        content: 'Damn boi!',
                        user: user._id
                    })
                    .end(() => {
                        Thread.findOne({
                                title: 'TestTitle'
                            })
                            .then(thread => {
                                console.log(thread)
                                assert(thread.comments.length === 1)
                                done()
                            })
                    })

            })
        })

    })

})