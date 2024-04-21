const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cpassword: {
        type: String,
        require: true
    },
    messages: [
        {
            name: {
                type: String,
                require: true
            }, email: {
                type: String,
                require: true
            }, message: {
                type: String,
                require: true
            }
        }
    ],
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]
})

userSchema.pre('save', async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
        this.cpassword = await bcrypt.hash(this.cpassword, 12);
    }
    next();
})

userSchema.methods.generateJWT = async function () {
    try {
        const id = this._id;
        let token = await jwt.sign({ _id: id }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return token;
    }catch(err){
        console.log(err);
    }
}
userSchema.methods.addmessage = async function (name, email, message) {
    try {
        this.messages = this.messages.concat({name,email,message});
        await this.save();
        return this.message;
    } catch (e) {
        console.log(e);
    }
}
const User = new mongoose.model("User", userSchema);
module.exports = User;