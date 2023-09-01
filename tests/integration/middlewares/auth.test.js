const request = require('supertest');
const { User } = require('../../../modules/users');
const { Genres } = require('../../../modules/genres');

describe('AUTH', () => {
    let token;
    let server;


    beforeEach(async () => {
        server = require('../../../main');
        token = await new User().generateAuthKey();
    })

    afterEach(async () => {
        await Genres.deleteMany({});
        await server.close();
    })

    const execute = () => {
        return request(server).post('/api/genres/').set('x-auth-token', token).send({ name: 'genre1' });
    }

    it('Should return 401 if token is no provided!', async () => {
        token = '';

        const res = await execute();

        expect(res.status).toBe(401);
    })

    it('Shouild return 400 if invalid token is provided', async () => {
        token = '1';

        const res = await execute();

        expect(res.status).toBe(400);
    })

    it('Should return 201 if valid token is provided', async () => {

        const res = await execute();

        expect(res.status).toBe(201);
    })
})

