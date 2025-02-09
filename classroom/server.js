const express= require("express");
const app=express();
//const cookieparser=require("cookie-parser");
const session= require("express-session");
const flash = require("connect-flash");
const path=require("path")

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));


app.use(session({
    secret:"newsecretcode",
    resave:false,
    saveUninitialized:true,
}))
app.use(flash())
//app.use(cookieparser("secretcode"))

app.use((req,res,next)=>{
    res.locals.msg=req.flash("succes");
    res.locals.err=req.flash("error");
    next();
})


app.get("/register",(req,res)=>{
    let {name="anonymos"}=req.query;
    
    req.session.name=name;
   // console.log(req.session)
    if(name==="anonymos"){
        req.flash("error","wrong req calll")
    }
    else{
        req.flash("succes","allright")
    }
    res.redirect("/hello")
});
app.get("/hello",(req,res)=>{
    
    res.render("page.ejs",{name:req.session.name});
})
// app.get("/test",(req,res)=>{
//     if(req.session.count){
//         req.session.count++;
//     }
//     else{
//         req.session.count=1;
//     }
//     res.send(`you sent request ${req.session.count} times`)
// })
// app.get("/getcookies",(req,res)=>{
//     res.cookie("greet","namaste");
//     res.cookie("made","india");
//     res.send("sent you a cookies")

// });
// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies
//     res.send(`hiii ${name}`);
// });

// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("madein","pakistan",{signed:true});
//     res.send(" signed cookies sent")
// });
// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies)
//     console.log(req.cookies)
//     res.send("verified")
// })

// app.get("/",(req,res)=>{
//     console.log(req.cookies)
//     res.send("hii i am root")
// })

app.listen(3030,()=>{
    console.log("server is listen  30330")
})