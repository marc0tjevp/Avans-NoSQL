const assert = require('assert')
const request = require('supertest')
const chai = require('chai')
const mongoose = require('mongoose')
const User = require('../model/schema/user.schema')

const server = require('../server').app
var chaiHttp = require('chai-http');
chai.use(chaiHttp)

describe('Users', () => {

    // Save a user
    it('Save a user to the database', done => {
        User.count().then(count => {
            chai.request(server)
                .post('/users/register')
                .send({
                    "username": "MarcoTest",
                    "password": "Test1234"
                })
                .end(() => {
                    User.count().then(newCount => {
                        assert(count + 1 === newCount)
                        done()
                    })
                })
        })
    })
})