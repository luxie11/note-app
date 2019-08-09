const express = require('express');
const Task = require('../models/task');
const router = new express.Router();
const authentication = require('../middleware/auth');

/**
 * HTTP POST - Tasks
 */
router.post('/tasks', authentication, async (req,res) => {
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    try {
        const taskPOST = await task.save();
        res.status(201).send(taskPOST);
    } catch(e) {
        res.status(400);
        res.send(e);
    }
});

/**
 * HTTP GET - Tasks (All)
 */
router.get('/tasks', authentication,async (req,res)=>{
    const match = {};
    const sort = {};

    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':');
        sort[parts[0]] = parts[1] === 'desc'? -1 : 1
    }
    try{
        await req.user.populate({
            path:'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.send(req.user.tasks);
    } catch(e) {
        res.status(500).send();
    }
});


// /**
//  * HTTP GET - Tasks (All)
//  */
// router.get('/tasks', authentication,async (req,res)=>{
//     try{
//         const task = await Task.find({ author:req.user._id });
//         res.send(task);
//     } catch(e) {
//         res.status(500).send();
//     }
// });


/**
 * HTTP GET - Tasks (By ID)
 */
router.get('/tasks/:id', authentication, async (req, res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findOne({ _id, author: req.user._id});
        if(!task)
            return res.status(404).send();
        res.send(task);
    } catch(e) {
        res.status(500).send();
    }
});

/**
 * HTTP DELETE - Tasks (By ID)
 */
router.delete('/tasks/:id', authentication, async (req,res)=>{
    const _id = req.params.id;
    try{
        const task = await Task.findByIdAndDelete({_id, author:req.user._id});
        if(!task)
            return res.status(404).send();
        res.send(task);
    } catch {
        res.status(400).send();
    }
});


/**
 * HTTP UPDATE - Task (By ID)
 */
router.patch('/tasks/:id', authentication, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpadates = ['description', 'completed'];
    const isAllowed = updates.every((element)=>{
        return allowedUpadates.includes(element);
    });

    if(!isAllowed)
        return res.status(400).send({ error: "Invalid update" });

    const _id = req.params.id;

    try{
        const task = await Task.findOne({_id, author: req.user._id});
        if(!task)
            return res.status(404).send();
        
        updates.forEach(element => {
            task[element] = req.body[element];
        });

        await task.save();
        res.send(task);
    } catch {
        res.status(400).send;
    }
});

module.exports = router;