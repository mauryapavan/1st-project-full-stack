const listning=require("./models/listing.js");// isting models
const reviews = require("./models/reviews.js");

module.exports.loggedin=(req,res,next)=>{
    console.log(req.originalUrl)
    
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        
        req.flash("error","you must be logged in");
       return res.redirect("/login");
    }
    next()
}

module.exports.saveredirecturl=(req,res,next)=>{
    
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    
    next();
}

module.exports.checkowner= async(req,res,next)=>{
    let {id}=req.params;
    const  listing= await listning.findById(id);
    if(! listing.owner._id.equals(res.locals.curruser._id)){
        req.flash("error","you are not the Owner of this listing");
       return  res.redirect(`/listing/${id}`);

    }
    next()
};
module.exports.checkownerreviews=async(req,res,next)=>{
    let {id,reviewId}=req.params;
   
    const  Reviews= await reviews.findById(reviewId);
    
    if(!  Reviews.author.equals(res.locals.curruser._id)){
        req.flash("error","you are not the author  of this reviews");
       return  res.redirect(`/listing/${id}`);

    }
    next()
}
