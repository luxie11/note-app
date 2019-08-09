const mongoose = require('mongoose');
const validator = require('validator');
const Task = require('../models/task');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required:true,
        trim:true,
        minlength: 7,
        validate(value){
            if(validator.contains(value.toLowerCase(),"password")){
                throw new Error('User password contains word - password. It isnt allowed');
            }
        }
    },
    email:{
        type: String,
        required: true,
        trim:true,
        lowercase:true,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    age:{
        type: Number,
        default: 0,
        validate(value){
            if(value < 0){
                throw new Error('Age must be positive number')
            }
        }
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }],
    avatar:{
        type: Buffer
    }
}, {
    timestamps:true
});

userSchema.virtual('tasks', {
    ref:'Task',
    localField: '_id',
    foreignField: 'author'
})

userSchema.statics.findByCredentials = async (email, pass) => {
    const user = await User.findOne({ email });
    if(!user){
        throw new Error('Unable to login');
    }

    const isMatched = await bcrypt.compare(pass,user.password);
    if(!isMatched){
        throw new Error('Unable to login');
    }

    return user;
}

userSchema.methods.getBackPublicData = function(){
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
    return userObject;
}

userSchema.methods.generateToken = async function() {
    const token = jwt.sign({ _id:this.id.toString() },process.env.JWT_SECRET);

    this.tokens = this.tokens.concat({ token });
    await this.save();

    return token;
}

//Hashing password
userSchema.pre('save', async function(next){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password, 8)
    }
    next();
});


userSchema.pre('remove', async function (next) {
    await Task.deleteMany({ author: this._id});
    next();
});

const User = mongoose.model('User', userSchema);

//Iskeliame is failo
module.exports = User;