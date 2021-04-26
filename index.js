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
const authRoute = require('./routes/auth.js');
const teamRoute = require('./routes/team.js');

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
const {isLoggedIn} = require('./middleware');
const Team = require('./models/teams.js');
 
//Middlewares
app.use((req,res,next)=> {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

//ROUTES
app.get('/',(req,res)=>{
    res.render('home.ejs')
})
app.get('/hackathons',isLoggedIn,async (req,res)=>{
    const hackathons = await Hackathon.find({});
    res.render("hackathons",{hackathons})
})
app.get('/hackathons/:id', isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    const users = await Hackathon.findById(id).populate('users').populate('teams');
    res.render('hackers',{users});
})
app.get('/profile/:id', isLoggedIn, async (req,res)=>{
        const {id} = req.params;
        const user = await User.findById(id)
        res.render('profile',{user})
})
app.post('/hackathons/:id/add',isLoggedIn, async (req,res)=>{
    const {id} = req.params;
    const hack = await Hackathon.findById(id).populate('users');
    const newUser = await User.findById({_id:req.user.id});

    for(user of hack.users){
        if(user.id === newUser.id){
            req.flash('error','You are already added');
            return res.redirect(`/hackathons/${id}`)
        }
    }
    hack.users.push(newUser);
    newUser.hackathons.push(hack);
    await hack.save();
    await newUser.save();
    req.flash('success','Successfully Added');
    res.redirect(`/hackathons/${id}`);
})
app.use('/',authRoute);
app.use('/hackathons/:id/',teamRoute);

app.get('*',(req,res)=>{
    res.render('notfound.ejs')
})