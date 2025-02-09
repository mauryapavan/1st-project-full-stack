const listning=require("../models/listing.js");// isting models

module.exports.index= async (req,res)=>{
    const allListing= await listning.find({})
   
   res.render("./listing/index.ejs",{allListing})
 };



 module.exports.creatlisting=(req,res)=>{

    res.render("./listing/new.ejs");
    };
module.exports.creatlistingpost=async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename
    const listing = await new listning(req.body.listing);
    listing.owner= req.user._id;
    listing.image={url,filename}
    
    await listing.save();
    console.log(listing)
    req.flash("succes","new listing is created !")
    res.redirect("/listing")
    
  }


  module.exports.show=async (req,res)=>{
    let {id}=req.params;
   const  listing= await listning.findById(id)
   .populate({path:"reviews",populate:{
  path:"author",
   }
  })
   .populate("owner");
   //console.log(listing)
   if(!listing){
    req.flash("error","Listing you requested for does not exit");
    res.redirect("/listing")
   }
   res.render("./listing/show.ejs",{listing})
    };



module.exports.edit=async (req,res)=>{
        let {id}=req.params;
        const  listing= await listning.findById(id);
        if(!listing){
          req.flash("error","Listing you requested for does not exit");
          res.redirect("/listing")
         }
        let orgurl=listing.image.url;
        orgurl=orgurl.replace("/upload","/upload/h_150,w_250");
        
        res.render("./listing/edit.ejs",{listing,orgurl})
    };
 module.exports.update=async (req,res,next)=>{
   let{id}=req.params;
   let listing=await listning.findByIdAndUpdate(id,{...req.body.listing})
   if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    await listing.save()
     }
   req.flash("succes","listing is update!")
    res.redirect(`/listing/${id}`)
  }


  module.exports.destroy= async(req,res)=>{
    let {id}=req.params
    const delet=await listning.findByIdAndDelete(id)
    req.flash("succes","listing delete!")
    res.redirect(`/listing`);
    console.log(delet);
   };
   
   module.exports.search=async(req,res)=>{
    let  {q}= req.query;
    let allListing = await listning.find({category:q})
    if(!allListing[0]){
      
      req.flash("error","Soerry this type places currently not available")
      res.redirect("/listing")
    }
    else{
      
      res.render("./listing/search.ejs",{allListing})
    }
    };

    module.exports.searchcountry=async(req,res)=>{
      let {country}=req.body
      let allListing = await listning.find({country:country.trim()})
      if(!allListing[0]){
        
        req.flash("error","that country not exist in wanderlust")
        res.redirect("/listing")
      }
      else{
        
        res.render("./listing/search.ejs",{allListing})
      }
      
    }