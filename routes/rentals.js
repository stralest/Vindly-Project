const express = require('express');
const { Rentals, validateRental } = require('../modules/rentals');
const { Customers } = require('../modules/customers');
const { Movies } = require('../modules/movies');
const auth = require('../middleware/auth');
const router = express.Router();

//api/rentals
router.get('/', async (req, res) => {
    const rentals = await Rentals.find();
    res.status(200).send(rentals);
})

//api/rentals/:id
router.get('/:id', async (req, res) => {
    const rentals = await Rentals.findById(req.params.id);
    if (!rentals) return res.status(200).send(`Rental with ${req.params.id} id was not found!`);

    res.status(200).send(rentals);
})


//api/rentals
router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(404).send(`Customer with ${req.body.customerId} id was not found!`);

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(404).send(`Movie with ${req.body.movieId} id was not found!`);

    if (movie.numberInStock === 0) return res.status(404).send('Movie out of stock!');

    const rental = new Rentals({
        customer: {
            _id: customer._id,
            name: customer.name,
            phone: customer.phone
        },
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }
    });

    await rental.save();

    movie.numberInStock--;
    await movie.save();

    res.status(201).send(rental);
})

//api/rentals/:id
router.put('/:id', async (req, res) => {
    const { error } = await validateRental(req.body);
    if (error) return res.status(400).send(error.message);

    const customer = await Customers.findById(req.body.customerId);
    if (!customer) return res.status(400).send(`Customer with ${req.body.customerId} id was not found!`);

    const movie = await Movies.findById(req.body.movieId);
    if (!movie) return res.status(400).send(`Movies with ${req.body.movieId} id was not found!`);

    const rental = await Rentals.findByIdAndUpdate({ _id: req.params.id }, {
        $set: {
            'customer.name': customer.name,
            'customer.isGold': customer.isGold,
            'customer.phone': customer.phone,
            'movie.title': movie.title,
            'movie.dailyRentalRate': movie.dailyRentalRate
        }
    }, { new: true });

    if (!rental) return res.status(404).send(`Rental with ${req.params.id} id was not found!`);

    res.status(200).send(rental);
})

//api/rentals/:id
router.delete('/:id', auth, async (req, res) => {
    const rental = await Rentals.findByIdAndRemove(req.params.id);
    if (!rental) res.status(404).send(`Rental with ${req.params.id} id was not found!`);

    res.status(204).send(rental);
})


module.exports = router;