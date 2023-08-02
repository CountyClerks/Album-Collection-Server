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
    body("first_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("First name must be specified.")
        .isAlphanumeric()
        .withMessage("First name has non-alphanumeric characters."),
    body("family_name")
        .trim()
        .isLength({ min: 1 })
        .escape()
        .withMessage("Last name must be specified.")
        .isAlphanumeric()
        .withMessage("Last name has non-alphanumeric characters."),
    body("debut_date", "Invalid date of debut")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),
    
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req)

        //Create Artist object with trimmed data.
        const artist = new Artist({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            debut_date: req.body.debut_date
        })

        if (!errors.isEmpty()) {
            //There are errors.
            res.render("artist_form", {
                title: "Create Artist",
                artist: artist,
                errors: errors.array()
            })
            return
        } else {
            await artist.save()

            res.redirect(artist.url)
        }
    })
]

exports.artist_delete_get = asyncHandler(async (req, res, next) => {
    const [artist, allAlbumsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Album.find({ artist: req.params.id}, "title description").exec()
    ])

    if (artist === null) {
        res.redirect("/catalog/artists")
    }

    res.render("artist_delete", {
        title: "Delete Artist",
        artist: artist,
        artist_albums: allAlbumsByArtist
    })
})

exports.artist_delete_post = asyncHandler(async (req, res, next) => {
    const [ artist, allAlbumsByArtist] = await Promise.all([
        Artist.findById(req.params.id).exec(),
        Albums.find({ artist: req.params.id}, "title description").exec()
    ])
    //We dont want to delete an artist's profile if they still have albums in our collection.
    if (allAlbumsByArtist.length > 0) {
        res.render("artist_delete", {
            title: "Delete Artist",
            artist: artist,
            artist_albums: allAlbumsByArtist,
        })
        return
    } else {
        await Artist.findByIdAndRemove(req.body.artistid)
        res.redirect("/catalog/artists")
    }
})

exports.artist_update_get = asyncHandler(async (req, res, next) => {

})

exports.artist_update_post = asyncHandler(async (req, res, next) => {

})