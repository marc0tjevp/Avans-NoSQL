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
        assert(true)
        done()
    })

    it('Should create a comment on a comment', done => {
        assert(true)
        done()
    })

    it('Should create a comment on a thread', done => {
        assert(true)
        done()
    })
    
    it('Should vote up the comment', done => {
        assert(true)
        done()
    })

    it('Should vote down the comment', done => {
        assert(true)
        done()
    })

    it('Should update the comment', done => {
        assert(true)
        done()
    })

    it('Should getByThreadId gets comments', done => {
        assert(true)
        done()
    })

    it('Should delete when id is added', done => {
        assert(true)
        done()
    })
})