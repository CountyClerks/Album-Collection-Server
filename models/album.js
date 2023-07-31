const mongoose = require ("mongoose")
const { DateTime } = require("luxon")

const Schema = mongoose.Schema

const AlbumSchema = new Schema({
    title: {type: String, required: true},
    summary: {type: String, required: true},
    artist: {type: Schema.Types.ObjectId, ref: 'Artist', required: true},
    price: {type: Number, required: true},
    quantity: {type: Number, required: true},
    release_date: {type: Date, required: true},
    genre: [{type: Schema.Types.ObjectId, ref: 'Genre'}],
    cover_art: {type: String, required: true},
})

AblumSchema.virtual('url').get(function() {
    return `/catalog/album/${this._id}`
})

AblumSchema.virtual('release_date_formatted').get(function(){
    return this.release_date ? DateTime.fromJSDate(this.release_date).toLocaleString(DateTime.DATE_MED): '';
})

module.exports = mongoose.model('Album', AlbumSchema)