const express = require('express')
const router = express.Router()

const artist_controller = require('../controllers/artistController')
const album_controller = require('../controllers/albumController')

//Home page
router.get('/', album_controller.index)

//Artists
router.get('/artist/create')
router.post('/artist/create')