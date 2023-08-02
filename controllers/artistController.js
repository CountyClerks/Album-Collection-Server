const Artist = require('../models/artist')
const Album = require('../models/album')

const asyncHandler = require('express-async-handler')
const { body, validationResult } = require('express-validator')


//Display list of all Artists.
exports.artist_list = asyncHandler(async (req, res, next) => {

    const allArtists = await Artist.find().sort({last_name: 1}).exec()

    res.render("artist_list", {
        title: "Artist List",
        artist_list: allArtists,
    })
})

//Display detail page for a specific Artist
exports.artist_detail = asyncHandler(async (req, res, next) => {

    const [artist, allAlbumsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Album.find({ artist: req.params.id }, "title description").exec(),
    ])
    //Throw error if no artist exist
    if (artist === null) {
        const err = new Error("Artist not found")
        err.status = 404
        return next(err)
    }

    res.render("artist_detail", {
        title: "Artist Detail",
        artist: artist,
        artist_albums: allAlbumsByArtist
    })
})

//GET form for creating artist
exports.artist_create_get = (req, res, next) => {
    res.render("artist_form", { title: "Create Artist"})
}

exports.artist_create_post = [

]

exports.artist_delete_get = asyncHandler(async (req, res, next) => {

})

exports.artist_delete_post = asyncHandler(async (req, res, next) => {

})

exports.artist_update_get = asyncHandler(async (req, res, next) => {

})

exports.artist_update_post = asyncHandler(async (req, res, next) => {

})