const app = require('../app')
const request = require('supertest').agent(app.listen())
const assert = require('chai').assert

describe('Gestión de usuario', function() {
    describe('Crear usuario', function() {
        it('Crear usuario normal', function(done) {
            request.get('/').
            expect(200).
            end(function(err, res) {
                assert(res.token)
            })
            done()
        })
    })
})
