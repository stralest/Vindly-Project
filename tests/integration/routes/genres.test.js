const request = require('supertest');
const { Genres } = require('../../../modules/genres');
const { User } = require('../../../modules/users');
const mongoose = require('mongoose');

describe('/api/genres', () => {
    let server;

    beforeEach(async () => {
        server = require('../../../main');
    })

    afterEach(async () => {
        await Genres.deleteMany({});
        await server.close();
    })


    describe('GET', () => {
        const execute = function () {
            return request(server).get('/api/genres/');
        }

        it('Should return list of all the genres', async () => {
            await Genres.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ])

            const res = await execute();
            expect(res.status).toBe(200);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        })
    })

    describe('GET/:id', () => {
        let id;
        let genre;

        beforeEach(async () => {
            genre = new Genres({ name: 'genre3' });
            await genre.save();
            id = genre._id;

        })

        const execute = function () {
            return request(server).get('/api/genres/' + id);
        }

        it('Should return single genre with valid id', async () => {
            const res = await execute();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);

        })

        it('Should return 404 if there is invalid id', async () => {
            id = '1';
            const res = await execute();
            expect(res.status).toBe(404);
        })

        it('Should return 404 if genre with given id doesent exists', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await execute();
            expect(res.status).toBe(404);
        })
    })

    describe('POST', () => {
        let token;
        let name;

        beforeEach(async () => {
            token = await new User().generateAuthKey();
            name = 'genre1';
        })

        const execute = () => {
            return request(server).post('/api/genres').set('x-auth-token', token).send({ name: name });
        }

        it('Should return 401 if client is not logged in', async () => {
            token = '';

            const res = await execute();

            expect(res.status).toBe(401);
        })

        it('Should return 400 if genre is less then 5 characters', async () => {

            name = '1234';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 400 if genre is longer then 255 characters', async () => {

            name = new Array(260).join('a');

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should save genre if it is valid', async () => {

            await execute();

            const genre = await Genres.find({ name: 'genre1' });

            expect(genre).not.toBeNull();
        })

        it('Should return 201 if genre is valid', async () => {

            name = '123456789';

            const res = await execute();

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', name);
        })
    })

    describe('PUT/:id', () => {
        let token;
        let genre;
        let newName;
        let id;


        beforeEach(async () => {
            genre = new Genres({ name: 'genre1' });
            await genre.save();

            token = await new User().generateAuthKey();
            id = genre._id;
            newName = 'newName';
        })

        const exec = async () => {
            return request(server).put('/api/genres/' + id).set('x-auth-token', token).send({ name: newName });
        }

        it('Should be 401 no token is provided', async () => {
            token = '';

            const res = await exec();

            expect(res.status).toBe(401);

        })

        it('Shoule be 400 if genre is less then 5 charachetrs long', async () => {
            newName = '1234';

            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('Shoule be 400 if genre is longer then 255 charachetrs long', async () => {
            newName = new Array(260).join('a');

            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('Should be 400 if invalid token is provided', async () => {
            token = '1';

            const res = await exec();

            expect(res.status).toBe(400);
        })

        it('Should be 500 if id is invalid', async () => {
            id = 1;

            const res = await exec();

            expect(res.status).toBe(500);
        })

        it('Should be 404 if given id was not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        })

        it('Should update single genre with valid id', async () => {
            await exec();

            const updatedGenre = await Genres.find({ name: newName });

            expect(updatedGenre).not.toBeNull();

        })
    })

    describe('DELETE/:id', () => {
        let id;
        let token;
        let genre;

        const execute = function () {
            return request(server).delete('/api/genres/' + id).set('x-auth-token', token).send();
        }

        beforeEach(async () => {
            genre = new Genres({ name: 'genre1' });
            await genre.save();

            id = genre._id;
            token = await new User({ isAdmin: true }).generateAuthKey();
        })

        it('Should be 401 if no token is provided', async () => {
            token = '';
            const res = await execute();
            expect(res.status).toBe(401);
        })

        it('Should be 400 if token is invalid', async () => {
            token = '1';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should be 403 if user is not admin', async () => {
            token = await new User({ isAdmin: false }).generateAuthKey();

            const res = await execute();

            expect(res.status).toBe(403);
        })

        it('Should be 404 if id doesent exists', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await execute();

            expect(res.status).toBe(404);
        })

        it('Should delete genre if valid id is given', async () => {
            await execute();

            const deletedGenre = await Genres.findById(id);

            expect(deletedGenre).toBeNull();
        })
    })
})