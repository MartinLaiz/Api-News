const app = require('../app')
const assert = require('assert')
const supertest = require('supertest')


describe('Gestión de usuario', function() {
    describe('Crear usuario', function() {
        it('Crear usuario normal', function() {
            supertest(app).post('/signup').send({ username: 'test', name: 'test name', password: 'test' }).
            expect(200).
            end(function(err, res){
                assert(res.body.token)
            })
        })
        it('Crear usuario repetido', function() {
            supertest(app).post('/signup').send({ username: 'test', name: 'test name', password: 'test' }).
            expect(200).
            end(function(err, res){
                assert.equal(res.body.token, null)
            })
        })
    })
    describe('Borrar usuarios', function() {
        it('Borrar usuarios test', function() {
            supertest(app).get('/users').
            expect(200).
            end(function(err, res){
                res.users.map(function(user) {
                    if(user.username.includes('test')) {
                        console.log('----------')
                        console.log(user)
                        supertest(app).post('/login').
                        send({ username: user.username, password: 'test' }).
                        expect(200).
                        end(function(err, res) {
                            supertest(app).delete('/users/'+user._id).
                            set('Authorization', res.token).
                            expect(200).
                            end()
                        })
                    }
                    return user
                })
            })
        })
    })
})

describe('Gestion de noticias', function() {
    it('Crear noticia', function() {
        supertest(app).post('/signup').send({ username: 'test', name: 'test name', password: 'test' }).
        expect(200).
        end(function(err, res){
            assert(res.body.token)
            supertest(app).post('/notices').
            send({ title: 'Titulo test', description: 'description' }).
            set('Authorization', res.body.token).
            expect(200).
            end(function(err, res){
                assert(res.body.notice._id)
            })
        })
    });
}
