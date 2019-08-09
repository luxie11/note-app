const express = require('express');
const User = require('../models/user');
const router = new express.Router();
const authentication = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');

const { sendWelcomeEmail, sendCancelationEmail } = require('../emails/account');

const upload = multer({
    limits:{
        fileSize:1000000
    },
    fileFilter(req, file, cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb(new Error('Please upload a image file (jpg/jpeg/png)'));
        }
        cb(undefined, true);
    }
});

/**
 * HTTP POST - Upload
 */
router.post('/users/me/avatar', authentication, upload.single('avatar'), async (req,res)=>{
    const buffer = await sharp(req.file.buffer).resize({
        width:250,
        height:250
    }).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save();
    res.send();
}, (error, req, res, next) =>{
    res.status(400).send({error: error.message});
});

/**
 * HTTP DELETE - Upload
 */
router.delete('/users/me/avatar', authentication, async (req, res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
})

router.get('/users/:id/avatar', async (req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if(!user || !user.avatar){
            throw new Error();
        }

        res.set('Content-type','image/png');
        res.send(user.avatar);
    } catch(e){
        res.status(404).send();
    }
})


/**
 * HTTP POST - Users
 */
router.post('/users',async (req, res) => {
    const user = new User(req.body);
    try {
        await user.save();
        //sendWelcomeEmail(user.name, user.name)
        const token = await user.generateToken();
        res.status(201).send({user, token});
    } catch(e) {
        res.status(400).send(e);
    }
   
});


//HTTP GET - with middleware 
router.get('/users/myaccount', authentication ,async (req,res) =>{
    res.send(req.user);
});




/**
 * HTTP UPDATE - User (By ID) with middleware
 */
router.patch('/users/myaccount', authentication, async (req,res) =>{
    const updates = Object.keys(req.body);
    const allowedUpadates = ['name','email','password','age'];
    const isValidOperation = updates.every((update)=>{
        return allowedUpadates.includes(update);
    });

    if(!isValidOperation){
        return res.status(400).send({ error: "Invalid update" });
    }
    try{
        updates.forEach((el) => {
            req.user[el] = req.body[el];
        });

        await req.user.save();

        //const user = await User.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true});
        res.send(req.user);
    } catch(e) {
        res.status(400).send();
    }
});

/**
 * HTTP DELETE - User (By ID) with middleware
 */
router.delete('/users/myaccount', authentication, async (req, res) =>{
    try{
        req.user.remove();
        sendCancelationEmail(req.user.email, req.user.name)
        res.send(req.user);
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/login', async (req,res) =>{
    try{
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateToken();
        res.send({ user: user.getBackPublicData(), token });
    } catch(e) {
        res.status(400).send();
    }
});

router.post('/users/logout', authentication, async (req,res)=>{
    try {
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token;
        });
        await req.user.save();

        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

router.post('/users/logoutAll', authentication, async (req,res)=>{
    try{
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch(e) {
        res.status(500).send();
    }
});

module.exports = router;