const express=require("express");
const router=express.Router({mergeParams:true});
const listning=require("../models/listing.js");// listing models

const wrapasync=require("../utils/wrapasync.js")// error wrap
const expreserror=require("../utils/expresserror.js") //-----> express error class
const {reviewsschema}=require("../schema.js");
const reviews=require("../models/reviews.js");
const { loggedin,checkownerreviews } = require("../middileware.js");



// <---------- validation for schema through middleware ---------->

const validatereviews =(req,res,next)=>{
    const {error}= reviewsschema.validate(req.body);
    if(error){
     
     throw new expreserror(400,`${error}`)
    }
    else{
      next()
    }
  }


//<_________________________________________REVIEWS ROUTES ____________________________>
// add comment

router.post("/",loggedin,validatereviews,wrapasync(async(req,res)=>{
    let listing= await listning.findById(req.params.id);
    //console.log(req.body.reviews)
    let newReview= new reviews(req.body.reviews);
    newReview.author=req.user._id
    console.log(newReview)
    listing.reviews.push(newReview);

    await newReview.save() ;
    await listing.save();
    req.flash("succes"," review is created !")
    res.redirect(`/listing/${req.params.id}`)
  }))
  // delete reviews
  router.delete("/:reviewId",
    loggedin,
    checkownerreviews,
    wrapasync( async(req,res)=>{
    let {id,reviewId}=req.params;
    await listning.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await reviews.findByIdAndDelete(reviewId)
    req.flash("succes","review is delete!")
    res.redirect(`/listing/${id}`)
  }));

  module.exports=router;
  