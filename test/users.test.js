const assert = require('assert')
const request = require('supertest')
const chai = require('chai')
const mongoose = require('mongoose')
const User = require('../model/schema/user.schema')
const auth = require('../config/authentication.config')

const server = require('../server').app
var chaiHttp = require('chai-http');
chai.use(chaiHttp)
chai.should()

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
                .end((err, res) => {
                    User.count().then(newCount => {
                        res.should.have.status(200)
                        res.should.be.json
                        res.body.should.be.a('object')
                        assert(count + 1 === newCount)
                        done()
                    })
                })
        })
    })

    it('should return a token when providing valid information', (done) => {

        const user = new User({
            username: 'MarcoTest',
            password: 'Test1234'
        })
        const token = auth.encodeToken("MarcoTest")

        user.save().then(() => {
            chai.request(server)
                .post('/users/login')
                .send({
                    "username": "MarcoTest",
                    "password": "Test1234"
                })
                .end(function (err, res) {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('object')
                    assert(res.body.message === token)
                    done()
                })
        })
    })

    it('should return a token when providing valid information', (done) => {

        const user = new User({
            username: 'MarcoTest',
            password: 'Test1234'
        })

        const token = auth.encodeToken("MarcoTest")

        user.save().then(() => {
            chai.request(server)
                .put('/users')
                .set('Authorization', token)
                .send({
                    "username": "MarcoTest",
                    "password": "Test1234",
                    "newpassword": "4321Test"
                })
                .end(function (err, res) {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('object')
                    console.log(res.body)
                    done()
                })
        })
    })

})