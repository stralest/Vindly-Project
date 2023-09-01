const { validateUser, User } = require('../modules/users');
const auth = require('../middleware/auth');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

//api/users
router.get('/', async (req, res) => {
    const users = await User.find();
    res.status(200).send(users);
})

//api/users/me
router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send(`User with ${req.user._id} id was not found!`);

    res.send(user);
})

//api/users/:id
/*router.get('/:id', async(req, res) => {
    const user = await User.findById(req.params.id);
    if(!user) return res.status(404).send(`User with ${req.params.id} id was not found!`);
    res.status(200).send(user);
})*/

//api/users
router.post('/', async (req, res) => {
    const { error } = await validateUser(req.body);
    if (error) return res.status(400).send(error.message);

    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send(`User with ${req.body.email} email is already registered!`);

    user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthKey();

    res.status(201).header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
})

//api/users/:id
router.put('/:id', async (req, res) => {
    const { error } = await validateUser(req.body);
    if (error) return res.status(400).send(error.message);

    const user = await User.findByIdAndUpdate(req.params.id, {
        $set: {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        }
    }, { new: true })
    if (!user) return res.status(404).send(`User with ${req.params.id} id was not found!`);

    res.status(200).send(_.pick(req.body, ['name', 'email']));
})

//api/users/:id
router.delete('/:id', async (req, res) => {
    const user = await User.findByIdAndRemove(req.params.id);
    if (!user) return res.status(404).send(`User with ${req.params.id} id was not found!`);

    res.status(204).send(user);
})


module.exports = router;