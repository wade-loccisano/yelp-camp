const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

// mongodb is not free on heroku ><

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    usedNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => {
    console.log('Database connected');
});

const sample = arr => arr[Math.floor(Math.random() * arr.length)];

const seedDB = async () => {
    await Campground.deleteMany({});

    for(let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 101);
        const camp = new Campground({
            author: '60413d40ff40c92ae44abbdb',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            description: 'This is the description',
            price : 0,
            geometry: { 
                type : "Point", 
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude
                ] 
            },
            images: [
                {
                    url: 'https://res.cloudinary.com/dgertiaeu/image/upload/v1615079737/YelpCamp/b62wop9o4dxi7zaqkwlw.jpg',
                    filename: 'YelpCamp/b62wop9o4dxi7zaqkwlw'
                }
            ]

        })
        await camp.save();

    }
}

seedDB().then(() => {
    mongoose.connection.close();
});