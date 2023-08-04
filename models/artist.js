const mongoose = require("mongoose");
const { DateTime } = require("luxon") 

const Schema = mongoose.Schema;

const ArtistSchema = new Schema({
    first_name: {type: String, required: true, maxLength: 100},
    last_name: {type: String, required: false, maxLength: 100},
    debut_date: {type: Date}
})

ArtistSchema.virtual("name").get(function() {
    //Return an empty string if the artist does not have a first or last name
    //If first & last name exist, return both
    let fullname = '';

    if (this.first_name && this.last_name) {
        fullname = `${this.first_name} ${this.last_name}`
    } else {
        fullname = `${this.first_name}`
    }
    return fullname
})

ArtistSchema.virtual('url').get(function() {
    return `/catalog/artist/${this._id}`
})

ArtistSchema.virtual('debut_date_formatted').get(function() {
    return this.debut_date ? DateTime.fromJSDate(this.debut_date).toLocaleString(DateTime.DATE_MED): '';
})

module.exports = mongoose.model("Artist", ArtistSchema)