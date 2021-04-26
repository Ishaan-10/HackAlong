const mongoose = require('mongoose');

const hackathonSchema = new mongoose.Schema({
    name: String,
    date:String,
    description:String,
    users:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    teams:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Team'
    }]
})

const Hackathon = new mongoose.model("Hackathon",hackathonSchema);

module.exports = Hackathon;