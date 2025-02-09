const express=require("express");
const router=express.Router();
const listning=require("../models/listing.js");// isting models
const wrapasync=require("../utils/wrapasync.js")// error wrap
const expreserror=require("../utils/expresserror.js") //-----> express error class
const {listingschema}=require("../schema.js");
const  { loggedin,checkowner}=require("../middileware.js");
const { populate } = require("../models/user.js");
const listingcontroller=require("../controller/listing.js");
const multer  = require('multer')
const {storage}=require("../cloudconfig..js")
const upload = multer({storage})


const validatelisting =(req,res,next)=>{
    const {error}= listingschema.validate(req.body);
    if(error){
     
     throw new expreserror(400,`${error}`)
    }
    else{
      next()
    }
  };

// listing
router.get("/", wrapasync( listingcontroller.index)) ;

//<------------- create listing --------->
  router.get("/new",loggedin,listingcontroller.creatlisting);

  router.post("/", loggedin,upload.single('listing[image]'),validatelisting, wrapasync( listingcontroller.creatlistingpost) );
  


// <---------show route----------->
router.get("/:id", wrapasync( listingcontroller.show));

//<---------- edit And Upadate ------->
router.get("/:id/edit",
  loggedin,
  checkowner,
  wrapasync( listingcontroller.edit));
  router.put("/:id",loggedin,checkowner,upload.single('listing[image]'),validatelisting, wrapasync(listingcontroller.update))
//<----------delete route--------->
router.delete("/:id",
  loggedin,
  checkowner,
  wrapasync( listingcontroller.destroy));
// <------------------------search on the basic of category--------------->
router.post("/search", wrapasync( listingcontroller.search));

// <___________searching country___________>
router.post("/search/country", wrapasync(listingcontroller.searchcountry ))


 module.exports=router;