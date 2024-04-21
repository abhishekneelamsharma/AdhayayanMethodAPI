const mongoose = require("mongoose");
const URL = process.env.URL;

const connectDB = async()=>{
    try{
        await mongoose.connect(URL);
        console.log("connected with mongoDB");
    }catch(err){
        console.log(err);
    }
}
connectDB();