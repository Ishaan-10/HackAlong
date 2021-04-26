const mongoose = require('mongoose');
const teamSchema = new mongoose.Schema({
    name:String,
    members:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    maxMembers:Number,
    field:{
        type:String,
        enum:['Web Development','App Development','Machine Learning','Blockchain','Others']
    }
})

const Team = new mongoose.model('Team',teamSchema);
module.exports = Team;