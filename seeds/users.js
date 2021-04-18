const User =require('../models/users');
const faker = require('faker');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HackAlong', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected");
});

makeUsers = async (amount) =>{
    User.deleteMany({});
    for(let i=0; i<amount;i++){

        const user = new User({
            name: faker.name.findName(),
            age: faker.datatype.number(),
            univesity:faker.company.companyName(),
            email:faker.internet.email(),
            city:faker.address.city(),
            github:`https://github.com/${faker.random.word()}`,
            linkedin:`https://linkedin.com/${faker.random.word()}`,
            skills:["lorem","ipusm"],
            achievments:[faker.lorem.words(), faker.lorem.words()]
        });

        console.log(user);
        await user.save();
    }
}
makeUsers(3);