const { User } = require('../../../modules/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('Token', () => {
    it('Should generate a valid auth key', () => {
        const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true };
        const user = new User(payload);
        const token = user.generateAuthKey();
        const decoded = jwt.verify(token, config.get('vidly_jwtPrivateKey'));
        expect(decoded).toMatchObject(payload);
    })
})