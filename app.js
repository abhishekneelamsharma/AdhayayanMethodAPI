const express = require("express");
const app = express();


const dotenv = require("dotenv");
dotenv.config({path:"./config.env"});

const PORT = process.env.PORT||5000;

const router = require("./Router/Router");
app.use(router);

require("./DB/connect");


app.get("/",(req,res)=>{
    res.send("hii");
})


app.listen(PORT,()=>{
    console.log(`server is Running at the port ${PORT}`);
})