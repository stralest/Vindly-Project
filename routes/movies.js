const { Movies, validatePost } = require('../modules/movies');
const { Genres } = require('../modules/genres');
const express = require('express');
const auth = require('../middleware/auth');
const router = express.Router();

router.get('/', async (req, res) => {
    const movies = await Movies.find();
    res.status(200).send(movies);
})

router.get('/:id', async (req, res) => {
    const movie = await Movies.findById(req.params.id);
    if (!movie) return res.status(404).send(`Movie with ${req.params.id} id was not found!`);

    res.status(200).send(movie);
})

router.post('/', auth, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = await Genres.findById(req.body.genreID);
    if (!genre) return res.status(404).send(`Genre with ${req.body.genreID} id was not found!`);

    const movie = new Movies({
        title: req.body.title,
        //genre: req.body.genre,
        genre: {
            _id: genre._id,
            name: genre.name
        },
        numberInStock: req.body.numberInStock,
        dailyRentalRate: req.body.dailyRentalRate
    })

    await movie.save();
    res.status(201).send(movie);
})

router.put('/:id', auth, async (req, res) => {
    const { error } = validatePost(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = await Genres.findById(req.body.genreID);
    if (!genre) return res.status(404).send(`Genre with ${req.body.genreID} if was not found!`);

    const movie = await Movies.findByIdAndUpdate(req.params.id, {
        $set: {
            title: req.body.title,
            "genre.name": genre.name,
            numberInStock: req.body.numberInStock,
            dailyRentalRate: req.body.dailyRentalRate
        }
    }, { new: true });
    if (!movie) return res.status(404).send(`Movie with ${req.params.id} id was not found!`);


    res.status(200).send(movie);

})

router.delete('/:id', auth, async (req, res) => {
    const movie = await Movies.findByIdAndDelete(req.params.id);
    if (!movie) return res.status(404).send(`Movie with ${req.params.id} id was not found!`);


    res.status(204).send(movie);
})

module.exports = router;
