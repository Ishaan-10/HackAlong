const express = require('express');
const passport = require('passport');
const router = express.Router({mergeParams:true});
const User = require('../models/users');
const Hackathon = require('../models/hackathons');
const Team = require('../models/teams');
const {isLoggedIn} = require('../middleware')

router.get('/createTeam/',isLoggedIn,async (req,res)=>{
    const {id} = req.params;
    const hackathon = await Hackathon.findById(id);
    res.render('createTeam.ejs',{hackathon});
})
router.post('/join/:teamId/',async (req,res)=>{
    const {id,teamId} = req.params;
    console.log(id , teamId);
    const hackathon = await Hackathon.findById(id);
    const team = await Team.findById(teamId).populate('members');

    if(team.members.length === team.maxMembers){
        req.flash('error','The team is full');
        return res.redirect(`/hackathons/${id}`)
    }

    for(member of team.members){
        if(member.id === req.user.id){
            req.flash('error','You are already added');
            return res.redirect(`/hackathons/${id}`)
        }
    }
    
    team.members.push(req.user);
    await team.save();
    req.flash('success','You were successfully added to the team');
    res.redirect(`/hackathons/${hackathon.id}/`);

})

router.post('/createTeam/',isLoggedIn,async (req,res)=>{

    const {id} = req.params;
    const hack = await Hackathon.findById(id);
    const {name,maxMembers,field,} = req.body;
    const team = new Team({name,maxMembers,field});
    team.members.push(req.user);
    hack.teams.push(team);

    console.log(team , hack);
    try{
        await team.save();
        await hack.save();
        req.flash('success',"Team successfully created");
    }catch(e){
        req.flash('error',"Could not create team "+e);
    }
    
    res.redirect(`/hackathons/${hack.id}`);
})


module.exports = router;