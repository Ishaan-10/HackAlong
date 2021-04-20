const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = new mongoose.Schema({
    name:String,
    univesity:String,
    email:{
        type:String,
        unique:true
    },
    city:String,
    github:String,
    linkedin:String,
    skills:[{
        type:String
    }],
    achievments:[{
        type:String
    }],
    hackathons:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hackathon'
    }]

})
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User",userSchema);

module.exports = User;