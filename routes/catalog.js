const express = require('express')
const router = express.Router()

const artist_controller = require('../controllers/artistController')
const album_controller = require('../controllers/albumController')
const genre_controller = require('../controllers/genreController')
const artist = require('../models/artist')

//Home page
router.get('/', album_controller.index)

                /*ARTISTS*/
//Create Artist
router.get('/artist/create', artist_controller.artist_create_get)
router.post('/artist/create', artist_controller.artist_create_post)

//Read singular artist and list of artists
router.get('/artist/:id', artist_controller.artist_detail)
router.get('/artists', artist_controller.artist_list)

//Update Artist
router.get('/artist/:id/update', artist_controller.artist_update_get)
router.post('/artist/:id/update', artist_controller.artist_update_post)

//Delete Artist
router.get('/artist/:id/delete', artist_controller.artist_delete_get)
router.post('/artist/:id/delete', artist_controller.artist_delete_post)


                /*ALBUMS*/

//Create Album
router.get('/album/create', album_controller.album_create_get)
router.post('/album/create', album_controller.album_create_post)

//Read singular album details
router.get('/album/:id', album_controller.album_detail)
//Read all album items
router.get('/albums', album_controller.album_list)

//Update Album
router.get('/album/:id/update', album_controller.album_update_get)
router.post('/album/:id/update', album_controller.album_update_post)

//Delete Album
router.get('/album/:id/delete', album_controller.album_delete_get)
router.post('/album/:id/delete', album_controller.album_delete_post)

                /*GENRE*/

//Create Genre
router.get('/genre/create', genre_controller.genre_create_get)
router.post('/genre/create', genre_controller.genre_create_post)

//Read genres
router.get('/genre/:id', genre_controller.genre_detail)
router.post('/genres', genre_controller.genre_list)

//Update Genre
router.get('/genre/:id/update', genre_controller.genre_update_get)
router.post('/genre/:id/update', genre_controller.genre_update_post)

//Delete Genre
router.get('/genre/:id/delete', genre_controller.genre_delete_get)
router.post('/genre/:id/delete', genre_controller.genre_delete_post)

module.exports = router;