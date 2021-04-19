//Express
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

//Staic files
app.use(express.static('public'));

//EJS and EJS mate
const ejsMate = require('ejs-mate');
app.set('view engine','ejs');
app.engine('ejs',ejsMate)

//Models
const User = require('./models/users.js');
const Hackathon =require('./models/hackathons.js');

//GET REQUESTS
app.get('/',(req,res)=>{
    res.render('home.ejs')
})
app.get('/hackathons',async (req,res)=>{
    const hackathons = await Hackathon.find({});
    res.render("hackathons",{hackathons})
})
app.get('/hackathons/:id',(req,res)=>{
    res.render("hackers")
})
app.get('/profile/:id',async (req,res)=>{
    const {id} = req.params;
    const user = await User.findById(id)
    res.render("profile.ejs",{user})
})
app.get('/login',(req,res)=>{
    res.render('login');
})
app.get('/register',(req,res)=>{
    res.render("register")
})
app.get('*',(req,res)=>{
    res.render('notfound.ejs')
})