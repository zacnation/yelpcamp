const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp';

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  // useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('Database connected');
});

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 400; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campground({
      author: '64db4864f97da80427bf19e5',
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet nam voluptatum vel beatae sequi, enim eveniet fugiat sit sint dolor quibusdam quos deserunt accusamus. Quos libero dolorem enim et odio.',
      price,
      geometry: {
        type: 'Point',
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      images: [
        {
          url: 'https://res.cloudinary.com/dbwkw7rme/image/upload/v1693407279/YelpCamp/xjamu7futd7kf2ribogz.avif',
          filename: 'YelpCamp/xjamu7futd7kf2ribogz',
        },
        {
          url: 'https://res.cloudinary.com/dbwkw7rme/image/upload/v1693407470/YelpCamp/uztetawifvtpoq04gxaz.jpg',
          filename: 'YelpCamp/uztetawifvtpoq04gxaz',
        },
        {
          url: 'https://res.cloudinary.com/dbwkw7rme/image/upload/v1693407444/YelpCamp/chjbj6ubcihda1bhvzii.jpg',
          filename: 'YelpCamp/chjbj6ubcihda1bhvzii',
        },
      ],
    });
    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
