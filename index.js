const express = require('express');
const app = express();

//Moongose settings
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/HackAlong', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Database connected");
});

//Port
app.listen('3000',(req,res)=>{
    console.log("Listening on port 3000");
})

//Models
const User = require('./models/users');
const Hackathon =require('./models/hackathons');

//GET REQUESTS
app.get('/',(req,res)=>{
    res.send("Home page")
})
app.get('/hackathons',(req,res)=>{
    res.send("hackathons")
})
app.get('/hackathons/:id',(req,res)=>{
    res.send("hackers")
})
app.get('/profile/:id',(req,res)=>{
    res.send("Profile")
})
app.get('/team',(req,res)=>{
    res.send("Team formation")
})