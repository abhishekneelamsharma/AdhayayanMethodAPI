const jwt = require("jsonwebtoken");
const User = require("../DB/Schema");

const Authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.jwtoken;
        const verifyToken = await jwt.verify(token, process.env.SECRET_KEY);
        const checkUser = await User.findOne({_id:verifyToken._id,"tokens.token":token});
        if(!checkUser){
            return res.status(400).json({ error: "Unauthorized: User not found" });
        }
        req.checkUser = checkUser;
        req.id = checkUser._id;
        next();

    } catch (err) {
        res.status(400).json({"msg":"no token provided"});
        // console.log(err);
    }
}

module.exports = Authenticate;