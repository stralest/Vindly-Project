const { Genres, validate } = require('../modules/genres');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const validationObejctID = require('../middleware/validateObjectID');

//api/genres
router.get('/', async (req, res) => {
    //throw new Error('Could not get the genres!');
    const genres = await Genres.find().sort({ name: 1 });

    res.status(200).send(genres);
});

//api/genres/
router.get('/:id', validationObejctID, async (req, res) => {

    const genre = await Genres.findById(req.params.id);

    if (!genre) return res.status(404).send(`Genre with ${req.params.id} id was not found!`);

    res.status(200).send(genre);
});

//api/genres/
router.post('/', auth, async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = new Genres({
        name: req.body.name
    })

    await genre.save();

    res.status(201).send(genre);
});

//api/genres/
router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.message);

    const genre = await Genres.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });
    if (!genre) return res.status(404).send(`Genre with ${req.params.id} id was not found!`);

    res.status(200).send(genre);
});

//api/genres/
router.delete('/:id', [auth, admin], async (req, res) => {
    const genre = await Genres.findByIdAndRemove(req.params.id);
    if (!genre) return res.status(404).send(`Genre with ${req.params.id} id was not found!`);

    res.status(204).send(genre);
});

module.exports = router;