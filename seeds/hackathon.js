const Hackathon =require('../models/hackathons');
const faker = require('faker');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HackAlong', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected");
});



makeHackathons = async (amount) =>{
    Hackathon.deleteMany({});
    for(let i=0; i<amount;i++){
        const hack = new Hackathon({
            name: faker.company.companyName(),
            date: faker.date.month(),
            description:faker.lorem.paragraph()
        });
        console.log(hack);
        await hack.save();
    }
}
makeHackathons(3);