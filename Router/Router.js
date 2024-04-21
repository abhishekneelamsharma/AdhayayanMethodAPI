const express = require("express");
const router = new express.Router();
const bcrypt = require("bcryptjs");

router.use(express.json());


const cors = require("cors");
router.use(cors({
    origin:"https://adhyayan-method-frontend.vercel.app",
    methods:["GET","POST"],
    credentials:true
}));

router.get("/ping",(req,res)=>{
    res.send("pong");
})

const cookieParser = require("cookie-parser");
router.use(cookieParser());


const User = require("../DB/Schema");

const Authenticate = require("../Middleware/Authenticate");



router.post("/signup", async (req, res) => {
    try {
        const { name, email, phone, password, cpassword } = req.body;
        if (!name || !email || !phone || !password || !cpassword) {
            return res.status(400).json({ error: "please fill all the fields" });
        }
        if (cpassword !== password) {
            return res.status(400).json({ error: "password doesn't match" });
        }

        const isUserExist = await User.findOne({ email });
        if (isUserExist) {
            return res.status(400).json({ error: "user already exist" });
        }
        const newUser = new User({ name, email, phone, password, cpassword });


        await newUser.save();
        res.status(201).json({ message: "user registered successfully" });
    } catch (err) {
        res.status(400).json({ "error": "it is an error in signup route" });
    }
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "please fill all the fields" });
        }
        const checkUserLogins = await User.findOne({ email });
        if (!checkUserLogins) {
            return res.json({ "error": "invalid credentials1" });
        }

        let token = await checkUserLogins.generateJWT();
        // let token = "abhishek"
        // console.log(token);
        res.cookie("jwtoken", token, {
            expires: new Date(Date.now() + 2592000000),
            httpOnly: true,
        })

        const isMatch = await bcrypt.compare(password, checkUserLogins.password);
        if (isMatch) {
            res.status(201).json({ "msg": "login successfully" });
        } else {
            res.status(400).json({ "error": "invalid details2" });
        }


    } catch (err) {
        console.log(err);
        res.send(err);
    }
})

router.get("/contact", Authenticate, (req, res) => {
    res.status(200).send(req.checkUser);
})

router.post("/contact", Authenticate, async (req, res) => {
    try {
        const {name,email,message} = req.body;
        
        if(!name || !email || !message){
            return res.json({error:"error in contact form"});
        }
        
        const findUser = await User.findOne({_id:req.id});
        if(findUser){
            const userMessage = await findUser.addmessage(name,email,message);
            await findUser.save();
            res.status(201).json({message:"user contact successfully"});
        }
    } catch (err) {
        console.log(err);
    }
})
router.get("/logout",(req,res)=>{
    console.log("logout page");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('user logout');
})
module.exports = router;