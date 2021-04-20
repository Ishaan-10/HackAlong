const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/users')
const {isLoggedIn} = require('../middleware')

router.get('/login',(req,res)=>{
    res.render('login');
})
router.get('/register',(req,res)=>{
    res.render("register")
}) 
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success','Successfully Logged Out')
    res.redirect('/');
})
router.post('/register',async (req,res)=>{
    let {name,username,university,email,city,github,linkedin,skills,achievments,hackathons,password} = req.body;
    skills = skills.split(',');
    achievments = achievments.split(',');
    const user = await new User({name,username,university,email,city,github,linkedin,skills,achievments,hackathons});
    const newUser = await User.register(user,password);
    req.login(newUser , err=>{
        if(err) return next(err);
        req.flash('success','Successfully Regsitered and Logged In') 
        res.redirect('/');
    })

})

router.post('/login',passport.authenticate('local',{
    failureRedirect: '/login',
    failureFlash: true }),(req,res)=>{
            req.flash('success','Successfully Logged In')
            const redirect = req.session.returnTo || '/';
            delete req.session.returnTo;
            res.redirect(redirect);
})
module.exports = router;