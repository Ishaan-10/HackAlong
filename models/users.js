const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    age:String,
    univesity:String,
    email:String,
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
        type:mongoose.Schema.Types.ObjectId
    }]

})

const User = new mongoose.model("User",userSchema);

module.exports = User;