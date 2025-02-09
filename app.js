require("dotenv").config();


const express=require("express");
const mongoose= require("mongoose");
const app=express();
const path=require("path")
const metoOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expreserror=require("./utils/expresserror.js") //-----> express error class
const session=require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const localstrategy=require("passport-local")
const user=require("./models/user.js");


const listingrouter=require("./routes/listing.js")
const reviewsrouter=require("./routes/reviews.js")
const userrouter=require("./routes/user.js")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(metoOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")))




const store=MongoStore.create({ 
  mongoUrl: process.env.atlas_DB ,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600,	// in second

  });

  store.on("err",()=>{
    console.log("ERROR=",err)
  })

const sessionoptions={
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires: Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  },

}
 




// <----------connect to mongoo DB---------->
main()
.then((res)=>{
    console.log("coonected to DB")
})
.catch(err => console.log(err));

async function main() {
  //await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
  await mongoose.connect(process.env.atlas_DB);

}


app.get("/",(req,res)=>{
  res.send("hii i am pawan")
})

app.use(session(sessionoptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localstrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser())

app.use((req,res,next)=>{
  res.locals.succes=req.flash("succes");
  res.locals.error=req.flash("error");
  res.locals.curruser=req.user;
  next()
})

app.use("/listing",listingrouter)
//<_________________________________________REVIEWS ROUTES ____________________________>
app.use("/listing/:id/reviews",reviewsrouter)
//<_______________user routes_________>
app.use("/",userrouter)

//demo storing password
app.get("/registeruser",async(req,res)=>{
  let fakeuser= new user({
    email:"std@gmail.com",
    username:"1st year student"
  });
  let newuser=await user.register(fakeuser,"hello");
  res.send(newuser)
})



 app.all("*",(req,res,next)=>{
  //console.log("hiiiiiii")
  next(new expreserror(404,"Page not found!!!!!"))
 })
 // <---------error handler ---------->
 app.use((err,req,res,next)=>{
  let {statusCode=500,message="something gone is wrong"}=err;
  res.status(statusCode).render("./listing/error.ejs",{message})
 })


app.listen(8181,()=>{
    console.log("server is listen");
})