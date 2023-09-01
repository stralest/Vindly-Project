const { Customers, validate } = require('../modules/customers');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

//api/customers
router.get('/', async (req, res) => {
    const customers = await Customers.find().sort({ name: 1 });
    res.status(200).send(customers);
})

router.get('/:id', async (req, res) => {
    const customers = await Customers.findById(req.params.id);
    if (!customers) return res.status(404).send(`Customer with ${req.params.id} id was not found!`);

    res.status(200).send(customers);
})

//api/customers
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = new Customers({
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    })
    await customer.save();
    res.status(201).send(customer);

})

//api/customer/:id
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = await Customers.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone
    }, { new: true })
    if (!customer) return res.status(404).send(`Customer with ${req.params.id} id was not found!`);

    res.status(200).send(customer);
})

//api/customers/:id
router.delete('/:id', [auth, admin], async (req, res) => {
    const customer = await Customers.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send(`Customer with ${req.params.id} id was not found!`);

    res.status(204).send(customer);
})

module.exports = router;