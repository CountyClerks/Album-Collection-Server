#! /usr/bin/env node

console.log(
  'This script populates some test books, artists, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
);

// Get arguments passed on command line
const userArgs = process.argv.slice(2);

const Album = require("./models/album");
const Artist = require("./models/artist");
const Genre = require("./models/genre");

const genres = [];
const artists = [];
const albums = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // Prepare for Mongoose 7

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createArtists();
  await createAlbums();
  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

// We pass the index to the ...Create functions so that, for example,
// genre[0] will always be the Fantasy genre, regardless of the order
// in which the elements of promise.all's argument complete.
async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function artistCreate(index, first_name, last_name, d_date) {
  const artistdetail = { first_name: first_name, last_name: last_name };
  if (d_date != false) artistdetail.debut_date = d_date;

  const artist = new Artist(artistdetail);

  await artist.save();
  artists[index] = artist;
  console.log(`Added artist: ${first_name} ${last_name}`);
}

async function albumCreate(index, title, summary, artist, price, quantity, release_date, genre, cover_art) {
  const artistdetail = {
    title: title,
    summary: summary,
    artist: artist,
    price: price,
    quantity: quantity,
    release_date: release_date,
    cover_art: cover_art,
  };
  if (genre != false) artistdetail.genre = genre;

  const album = new Album(albumdetail);
  await album.save();
  albums[index] = album;
  console.log(`Added album: ${title}`);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "K-Pop"),
    genreCreate(1, "R&B"),
    genreCreate(2, "Hip Hop"),
  ]);
}

async function createArtists() {
  console.log("Adding artists");
  await Promise.all([
    artistCreate(0, "Red", "Velvet", "2014-08-1"),
    artistCreate(1, "Loona", false, "2016-08-20"),
    artistCreate(2, "Bruno", "Mars", "2010-07-20"),
    artistCreate(3, "Janelle", "Monae", "2010-05-18"),
    artistCreate(4, "JID", false, "2017-03-10"),
  ]);
}

async function createAlbums() {
  console.log("Adding Albums");
  await Promise.all([
    albumCreate(0,
      "Perfect Velvet",
      "The second full-length album from Red Velvet, released on November 17, 2017. With lead single 'Peek-A-Boo', the album features 9 songs.",
      artists[0],
      30.00,
      5,
      "2017-11-17",
      [genres[0]],
      "https://m.media-amazon.com/images/I/51rIj8pz0ZL.jpg",
    ),
    albumCreate(1,
      "[X X]",
      `[X X] is the repackage album of Loona's debut mini-album [+ +]. The album features 12 songs, with the lead single "Butterfly"`,
      artists[1],
      25.00,
      2,
      "2018-08-20",
      [genres[0]],
      "https://i.imgur.com/W7gHtDI.jpeg",
    ),
    albumCreate(2,
      "24K Magic",
      "The third studio album by notorious singer Bruno Mars. Best known for it's lead single of the same name, 24K Magic, the album features 9 songs.",
      artists[2],
      20.00,
      7,
      "2016-11-18",
      [genres[1]],
      "https://m.media-amazon.com/images/I/61R6q0kujrL._SL1204_.jpg",
    ),
    albumCreate(3,
      "Dirty Computer",
      "Dirty Computer is the third studio album by singer and songwriter Janelle Monae. The album features 14 songs.",
      artists[3],
      15.00,
      1,
      "2018-04-27",
      [genres[1]],
      "https://m.media-amazon.com/images/I/91flvVzJ-8L._SL1425_.jpg",
    ),
    albumCreate(4,
      "The Never Story",
      `JID's debut album released in 2017. The album features 12 songs with it's lead single "Never".`,
      artists[4],
      22.00,
      8,
      "2017-03-10",
      [genres[2]],
      "https://m.media-amazon.com/images/I/81WG63XD0FL._SL1200_.jpg",
    ),
  ]);
}
 //No need for instances since theres no due backs or loans like the library system. The albums get sold and that's it.
