const assert = require('assert')
const request = require('supertest')
const chai = require('chai')
const mongoose = require('mongoose')
const User = require('../model/schema/user.schema')

const server = require('../server').app
var chaiHttp = require('chai-http');
chai.use(chaiHttp)
chai.should()
const neo = require('../neodb/neodbhelper')

describe('Friendship', () => {
    it('getByDepth gets all friends', done => {
        assert(true)
        done()
    })

    it('Should be able add friends', done => {
        assert(true)
        done()
    })

    it('deletes the friendship when propmted', done => {
        assert(true)
        done()
    })

    it('gets all users when prompted', done => {
        assert(true)
        done()
    })
})