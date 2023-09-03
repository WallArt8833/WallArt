const mongoose = require("mongoose");

const WallSchema  = mongoose.Schema({
    imgurl:{
        type:String,
        required:true
    },
    cat:{
        type: String,
        required:true
    },
    
},{timestamps : true});

module.exports= mongoose.model("Wall", WallSchema);