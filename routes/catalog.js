const express = require('express')
const router = express.Router()

const artist_controller = require('../controllers/artistController')
const album_controller = require('../controllers/albumController')

//Home page
router.get('/', album_controller.index)

        /*ARTISTS*/
router.get('/artist/create')
router.post('/artist/create')

        /*ALBUMS*/

//Create Album
router.get('/album/create')
router.post('/album/create')

//Read singular album details
router.get('/album/:id', album_controller.album_detail)
//Read all album items
router.get('/albums', album_controller.album_list)

//Update Album
router.get('/album/:id/update')
router.post('/album/:id/update')

//Delete Album
router.get('/album/:id/delete')
router.post('/album/:id/delete')
