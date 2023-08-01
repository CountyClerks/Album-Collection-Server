const Artist = require('../models/artist')
const Album = require('../models/album')
const Genre = require('../models/genre')

const asyncHandler = require('express-async-handler')
// const { body, validationResult } = require('express-validator')

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