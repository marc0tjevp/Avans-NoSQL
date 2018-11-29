const assert = require('assert')
const request = require('supertest')
const chai = require('chai')
const mongoose = require('mongoose')
const User = require('../model/schema/user.schema')
const Thread = require('../model/schema/thread.schema')
const auth = require('../config/authentication.config')
const mocha = require('mocha')

const server = require('../server').app
var chaiHttp = require('chai-http');
chai.use(chaiHttp)

describe('Threads',()=>{
    


    it('Saves a thread to the database with a user', done => {
        const user = new User({
            username: "MarcoTest",
            password: "Test1234"
        })
        const token = auth.encodeToken("MarcoTest")
        user.save().then(() => {
            Thread.count().then(count =>{
            chai.request(server)
                .post('/threads')
                .set('Authorization',token)
                .send({
                    "content":"SomeContent",
                    "title":"TestTitle"
                }).end(()=>{
                    Thread.count().then(newCount=>{
                        assert(count+1===newCount)
                        done()
                    })
                })
            })
        })
    })

    it('Deletes a thread from the database with the id of the thread', done => {
        const user = new User({
            username: "MarcoTest",
            password: "Test1234"
        })
        const token = auth.encodeToken("MarcoTest")
        user.save().then(()=>{
            chai.request(server)
                .post('/threads')
                .set('Authorization',token)
                .send({
                    "content":"SomeContent",
                    "title":"TestTitle"
                }).end(()=>{
                    Thread.count().then(count=>{
                    Thread.findOne({content:"SomeContent"},{},(err,something)=>{
                        
                        chai.request(server)
                            .del('/threads/'+something._id)
                            .set({'Authorization':token})
                            .end(()=>{
                                Thread.count().then((newCount)=>{
                                    
                                    assert(count!=newCount)
                                    done()
                                })
                        })
                    })
                })
            })
        })
    })

    it('should update a thread', (done) => {

        const user = new User({
            username: "MarcoTest",
            password: "Test1234"
        })
        const token = auth.encodeToken("MarcoTest")
        user.save().then(()=>{
            const thread = new Thread({
                user:user._id,
                content:"SomeContent",
                title:"TestTitle"
            })
            thread.save().then(()=>{
                console.log(thread)
                chai.request(server)
                .put('/threads/'+thread._id)
                .set('Authorization', token)
                .send({
                    "content": "Oh hey look new content"
                })
                .end(function (err, res) {
                    res.should.have.status(200)
                    res.should.be.json
                    res.body.should.be.a('object')
                    
                    done()
                })
            })
            
        })
    })
    
    it('should get All Threads',(done)=>{
        const user = new User({
            username: "MarcoTest",
            password: "Test1234"
        })
        user.save().then(()=>{
            const thread = new Thread({
                user:user._id,
                content:"SomeContent",
                title:"TestTitle"
            })
            const thread2 = new Thread({
                user: user._id,
                content:"MoreContent",
                title:"Title2"
            })
            thread.save().then(()=>{
                thread2.save().then(()=>{
                    chai.request(server)
                    .get('/threads')
                    .end(function(err,res){
                        res.should.have.status(200)
                        res.should.be.json
                        res.body.should.be.a('object')
                        done()
                    })
                })
            })
        })
    })

    it('should get a Thread with an id',(done)=>{
        const user = new User({
            username: "MarcoTest",
            password: "Test1234"
        })
        user.save().then(()=>{
            const thread = new Thread({
                user:user._id,
                content:"SomeContent",
                title:"TestTitle"
            })
            thread.save().then(()=>{
                    chai.request(server)
                    .get('/threads/'+thread._id)
                    .end(function(err,res){
                        res.should.have.status(200)
                        res.should.be.json
                        res.body.should.be.a('object')
                        done()
                    })
                
            })
        })
    })
})