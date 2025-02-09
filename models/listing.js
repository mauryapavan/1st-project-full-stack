const mongoose= require("mongoose");
const { type } = require("../schema");
const Schema=mongoose.Schema;
const reviews=require("./reviews.js");
const { string } = require("joi");

const listingSchema=new Schema({
    tittle:{
        type:String,
        required:true
    },
    description:{ 
        type:String,
        
    },
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[{
        type: Schema.Types.ObjectId,
        ref:"reviews"
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref:"user"
    },
    category:{
        type:String,
        enum:["farms","rooms","iconic cities","mountains","camping","arctic"],
    }

});
listingSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await reviews.deleteMany({_id:{$in:listing.reviews}})
    }
})


const listning= new mongoose.model("listning",listingSchema);
module.exports=listning;