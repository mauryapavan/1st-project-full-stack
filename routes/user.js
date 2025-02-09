const express=require("express");
const wrapasync = require("../utils/wrapasync");
const router=express.Router();
const user=require("../models/user.js");
const passport=require("passport");
const {saveredirecturl}=require("../middileware.js")


//<____________signup________>
router.get("/signup",(req,res)=>{
    res.render("./user/signup.ejs")
});
router.post("/signup",wrapasync(  async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newuser=new user({email,username})
    const reguser=  await user.register(newuser,password);
    console.log(reguser);
    req.login(reguser,(err)=>{
        if(err){
            next(err)
        };
        req.flash("succes","welcome to wanderlust");
        res.redirect("/listing")
    })
    }
    catch(e){
        req.flash("error",e.message);
        res.redirect("/signup")
    }
}));
//<________----login______>
router.get("/login",(req,res)=>{
    res.render("./user/login.ejs")
});
router.post("/login",
    saveredirecturl,
     passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true,
}),
async(req,res)=>{
    
    req.flash("succes","welcome back to wanderlust");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl)
    }
    else{res.redirect("/listing");}
}
);

//<_______-_----logout_____________>
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
           return next(err)
        }
        req.flash("succes","logged out you");
        res.redirect("/listing")
    })
})

module.exports=router