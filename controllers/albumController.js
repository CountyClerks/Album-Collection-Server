const Artist = require('../models/artist')
const Album = require('../models/album')
const Genre = require('../models/genre')

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')


//MIGHT DO: Build app out as all-in-one express app with view, then transfer over to React front end
//REASON: first time building a backend with a separated front end

exports.index = asyncHandler(async (req, res, next) => {
    //Get details of artists, albums, and genres

    const [
        numArtists,
        numAlbums,
        numGenres,
    ] = await Promise.all([
        Artist.countDocuments({}).exec(),
        Album.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
    ])

    res.render('index', {
        title: 'Album Collection Home',
        artist_count: numArtists,
        album_count: numAlbums,
        genre_count: numGenres,
    })
})

//Display list of all albums
exports.album_list = asyncHandler(async (req, res, next) => {
    const allAlbums = await Album.find({}, "title artist")
        .sort({title: 1})
        .populate("artist")
        .exec()
    res.render("album_list", {title: "Album List", album_list: allAlbums})
})

exports.album_detail = asyncHandler(async (req, res, next) => {
    const album = await Album.findById(req.params.id).populate("artist").populate("genre").exec()

    if (album === null) {
        const err = new Error("Album not found")
        err.status = 404
        return next(err)
    }

    res.render("album_detail", {
        title: album.title,
        album: album,
    })
})

exports.album_create_get = asyncHandler(async (req, res, next) => {
    const [allArtists, allGenres] = await Promise.all([
        Artist.find().exec(),
        Genre.find().exec(),
    ])

    res.render("album_form", {
        title: "Create Book",
        artist: allArtists,
        genres: allGenres,
    })
})

exports.album_create_post = [
    (req, res, next) => {
        if (!(req.body.genre instanceof Array)) {
            if (typeof req.body.genre === 'undefined') req.body.genre = []
            else req.body.genre = new Array(req.body.genre)
        }
        next()
    },
    body("title", "Title must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("artist", "Author must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description must not be empty")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("price", "Price must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("quantity", "Quantity must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("release_date", "Release date must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("covert_art", "Covert art must not be empty.")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("genre.*").escape(),

    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        const album = new Album({
            title: req.body.title,
            artist: req.body.artist,
            description: req.body.description,
            price: req.body.price,
            quantity: req.body.quantity,
            release_date: req.body.release_date,
            genre: req.body.genre,
            cover_art: req.body.cover_art,
        })

        if (!errors.isEmpty()) {
            const [allArtists, allGenres] = await Promise.all([
                Artist.find().exec(),
                Genre.find().exec(),
            ])

            for (const genre of allGenres) {
                if (album.genre.indexOf(genre._id) > -1) {
                    genre.checked = "true";
                }
            }

            res.render("album_form", {
                title: "Create Album",
                artist: allArtists,
                genres: allGenres,
                album: album,
                errors: errors.array()
            })

        } else {
            await album.save()
            res.redirect(album.url)
        }
    })
]
