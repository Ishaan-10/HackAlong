//Express
const express = require('express');
const app = express();
app.use(express.urlencoded({extended:true}));

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
const auth = require('./routes/auth.js');

//Session
const session = require('express-session');
const sessionConfig = {
    secret:'test',
    resave: false,
    saveUninitialized: true,
    cookie:{
        httpOnly:true,
        expires:Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge:Date.now() + 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));

//Connect-Flash
const flash = require('connect-flash');
app.use(flash());

//Passport
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const {isLoggedIn} = require('./middleware')
 
//Middlewares
app.use((req,res,next)=> {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//GET REQUESTS
app.get('/',(req,res)=>{
    res.render('home.ejs')
})
app.get('/hackathons',isLoggedIn,async (req,res)=>{
    const hackathons = await Hackathon.find({});
    res.render("hackathons",{hackathons})
})
app.get('/hackathons/:id', isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    const users = await Hackathon.findById(id).populate('users');
    res.render('hackers',{users});
})
app.get('/profile/:id', isLoggedIn, async (req,res)=>{
        const {id} = req.params;
        const user = await User.findById(id)
        res.render('profile',{user})
})
app.post('/hackathons/:id/add',isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    const hack = await Hackathon.findById(id);
    console.log(hack);
    const newUser = await User.findById({_id:req.user.id});
    console.log(newUser);
    hack.users.push(newUser);
    newUser.hackathons.push(hack);
    await hack.save();
    await newUser.save();
    res.redirect(`hackathon/${id}/`);
})
app.use('/',auth);

app.get('*',(req,res)=>{
    res.render('notfound.ejs')
})