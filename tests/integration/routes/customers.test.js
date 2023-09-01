const { Customers } = require('../../../modules/customers');
const { User } = require('../../../modules/users');
const request = require('supertest');
const mongoose = require('mongoose');

describe('/api/customers', () => {
    let server;

    beforeEach(async () => {
        server = require('../../../main');

    })

    afterEach(async () => {
        await Customers.deleteMany({});
        await server.close();

    })

    describe('GET', () => {

        const execute = function () {
            return request(server).get('/api/customers/');
        }


        it('Should return of all customers', async () => {
            await Customers.collection.insertMany([
                { name: 'customer1' },
                { name: 'customer2' }
            ])

            const res = await execute();
            expect(res.status).toBe(200);
            expect(res.body.some(c => c.name === 'customer1')).toBeTruthy();
            expect(res.body.some(c => c.name === 'customer2')).toBeTruthy();
        })
    })

    describe('GET/:id', () => {
        let customer;
        let id;

        const execute = async function () {
            return request(server).get('/api/customers/' + id);
        }

        beforeEach(async () => {
            customer = new Customers({ name: 'customer1', phone: '12345' });
            await customer.save();
            id = customer._id;
        })

        it('Should retrun single customer if id is valid', async () => {
            const res = await execute();
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', customer.name);
            expect(res.body).toHaveProperty('_id');
        })

        it('Should return 500 if id is invalid', async () => {
            id = '1';
            const res = await execute();
            expect(res.status).toBe(500);
        })

        it('Should return 404 if id not exists', async () => {
            id = new mongoose.Types.ObjectId();
            const res = await execute();
            expect(res.status).toBe(404);
        })
    })

    describe('POST', () => {
        let token;
        let name;
        let phone;

        beforeEach(async () => {
            /*customer = new Customers({ name: 'strale', phone: '12345' });
            await customer.save();*/
            token = await new User().generateAuthKey();
            name = 'strale333';
            phone = '12345';
        })

        const execute = async () => {
            return request(server).post('/api/customers/').set('x-auth-token', token).send({ name: name, phone: phone });
        }

        it('Should retrun 401 is no token is provided', async () => {
            token = '';

            const res = await execute();

            expect(res.status).toBe(401);
        })

        it('Should return 400 if token is invalid', async () => {
            token = '1';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 400 if name property is shorter then 5 char', async () => {
            name = 'str';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 400 if name property is longer then 30 char', async () => {
            name = new Array(32).join('a');

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 400 if phone property is shorter then 5 char', async () => {
            phone = '123';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 400 if phone property is longer then 30 char', async () => {
            name = new Array(32).join('a');

            const res = await execute();

            expect(res.status).toBe(400);
        })



        it('Should save customer if it is valid', async () => {
            await execute();

            const res = await Customers.find({ name: 'strale333' });

            //expect(res.status).toBe(201);
            expect(res).not.toBeNull();
        })

        it('Should return 201 if customer is valid', async () => {
            const res = await execute();

            expect(res.status).toBe(201);
            expect(res.body).toHaveProperty('name', name);
            expect(res.body).toHaveProperty('phone', phone);
        })
    })

    describe('PUT/:id', () => {
        let token;
        let customer;
        let newName;
        let newPhone;
        let id;

        beforeEach(async () => {
            token = await new User().generateAuthKey();
            customer = new Customers({ name: 'strale333', phone: '12345' });
            await customer.save();

            id = customer._id;
            newName = 'novoIme';
            newPhone = 'noviBroj';
        })

        const execute = async () => {
            return request(server).put('/api/customers/' + id).set('x-auth-token', token).send({ name: newName, phone: newPhone });
        }

        it('Should return 401 if token is not provided', async () => {
            token = '';

            const res = await execute();

            expect(res.status).toBe(401);
        })

        it('Should return 400 if token is invalid', async () => {
            token = '1';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 404 if customer was not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await execute();

            expect(res.status).toBe(404);
        })

        it('Should save customer if credentials are valid', async () => {
            await execute();

            const customer = await Customers.find({ name: newName, phone: newPhone });

            expect(customer).not.toBeNull();
        })

        it('Should return 200 if credentials are valid', async () => {
            const res = await execute();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', newName);
            expect(res.body).toHaveProperty('phone', newPhone);
        })
    })

    describe('DELETE/:id', () => {
        let token;
        let customer;
        let id;

        beforeEach(async () => {
            token = await new User({ isAdmin: true }).generateAuthKey();
            customer = new Customers({ name: 'strale333', phone: '12345' });
            await customer.save();

            id = customer._id;
        })

        const execute = async () => {
            return request(server).delete('/api/customers/' + id).set('x-auth-token', token).send();
        }

        it('Should return 401 if no token is provided', async () => {
            token = '';

            const res = await execute();

            expect(res.status).toBe(401);
        })

        it('Should return 400 if invalid token is provided', async () => {
            token = '1';

            const res = await execute();

            expect(res.status).toBe(400);
        })

        it('Should return 404 if customer is not found', async () => {
            id = new mongoose.Types.ObjectId();

            const res = await execute();

            expect(res.status).toBe(404);
        })

        it('Should return 403 if not admin', async () => {
            token = await new User({ isAdmin: false }).generateAuthKey();

            const res = await execute();

            expect(res.status).toBe(403);
        })

        it('Should return 204 if genre is successfuly deleted', async () => {
            await execute();

            const customer = await Customers.findById(id);

            expect(customer).toBeNull();
        })
    })
})