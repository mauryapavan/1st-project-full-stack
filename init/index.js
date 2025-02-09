const mongoose= require("mongoose");
const initdata=require("./data.js");
const listning=require("../models/listing.js")

//connect to mongoo DB
main()
.then((res)=>{
    console.log("coonected to DB")
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');

};

const initdb=async ()=>{
    await listning.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({...obj,owner:"6788e9a59a7c26f5ec05a2fb"}))
    await listning.insertMany(initdata.data)
   console.log("data was initialise is succesful");
}


initdb();