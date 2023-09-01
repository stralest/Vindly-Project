const { Rentals } = require('../../../modules/rentals');
const { User } = require('../../../modules/users');
const mongoose = require('mongoose');
const request = require('supertest');

describe('/api/returns', () => {
    let server;
    let rental;
    let customerId;
    let movieId;
    let token;

    const execute = function() {
        return request(server).post('/api/returns/').set('x-auth-token', token).send(customerId, movieId);
    }


    beforeEach(async () => {
        server = require('../../../main');
        
        customerId = new mongoose.Types.ObjectId();
        movieId = new mongoose.Types.ObjectId();
        token = await new User().generateAuthKey();

        rental = new Rentals({
            customer: {
                _id: customerId,
                name: 'strale',
                phone: '12345'
            },
            movie: {
                _id: movieId,
                title: 'action',
                dailyRentalRate: 2
            }
        })

        await rental.save();
    })

    afterEach(async () => {
        await Rentals.deleteMany({});
        await server.close();
    })

    it('Should return 401 if client is not logged in', async () => {
        token = '';

        const res = await execute();

        expect(res.status).toBe(401);
    })

    it('Should return 401 if invalid token', async() => {
        token = '1';

        const res = await execute();

        expect(res.status).toBe(401);
    })

    it('Should return 404 if customer id was not found', async() => {
        customerId = new mongoose.Types.ObjectId();

        const res = await execute();

        expect(res.status).toBe(404);
    })
})