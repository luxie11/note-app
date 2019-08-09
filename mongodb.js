//CRUD create read update delete

// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;

const { MongoClient, ObjectID }  = require('mongodb');

const id = new ObjectID();

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

MongoClient.connect(connectionURL, {useNewUrlParser : true}, (error, client) =>{
    if(error)
        return console.log('Negalima prisijungi prie duomenu bazes');
    
    const db = client.db(databaseName);
    db.collection('users').deleteMany({
        age: 10
    }).then((results) =>{
        console.log(results);
    }).catch((error) => {
        console.log(error);
    })
});