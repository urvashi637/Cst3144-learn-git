const express = require('express');
//const bodyParser = require('body-parser);
const app = express();

//Create an Express.js instance
app.use(express.json());

//config Express.js
app.set('port', 3000);
app.use((req, res, next) =>{
    res.setHeader('Acess-Control-Allow-Origin', '*');
    res.setHeader("Acess-Control-Allow-Credentials", "*");
    res.setHeader("Acess-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT");
    res.setHeader("Acess-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
})

const MongoClient = require('mongodb').MongoClient;

let db;
MongoClient.connect('mongodb+srv://urvashisoni:I6azkjzq@cluster0.nkeoq8c.mongodb.net', (err, client) => {
db = client.db('webstore')
})

app.get('/', (req, res, next) => {
    res.send('select a collection, e.g., /collection/messages')
})

app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    return next()
})

app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
            res.send(results)
    })
})

//adding post
app.post('/collection/:collectionName', (req, res, next) =>{
    req.collection.insert(req.body, (e, results) => {
        if(e) return next(e)
            res.send(results.ops)
    })
})

const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id', (req, res, next)=> {
    req.collection.findOne({_id: new ObjectID(req.params.id)}, ( e, result) => {
        if(e) return next(e)
            res.send(result)
    })
})

// adding put 
app.put ('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
        {_id: new ObjectID(req.params.id)},
        {$set: req.body},
        {safe: true, multi: false},
        (e, result) => {
            if (e) return next(e)
                res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
})

// adding delete
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
        {_id: ObjectID(req.params.id)},(e, result) => {
            if(e) return next(e)
            res.send((result.result.n === 1) ? 
            {msg: 'success'}: {mgs: 'error'})
        })
})

const port = process.env.PORT || 3000
app.listen(port)