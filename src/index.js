const express = require('express');
require ('./db/mongoose');

//MongoDB collections
const User = require('./models/user');
const Task = require('./models/task');

//Routers
const userRouter = require('./routers/user');
const taskRouter = require('./routers/task');

const app = express();
const port = process.env.PORT;


app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port,()=>{
    console.log('Server is up on port', port);
});
