const express = require('express')
const mongodb = require('mongodb')

const connectionURL = 'mongodb://localhost:27017'
const databaseName = 'TaskDB'
const databaseCollection = 'tasks'

const app = express()
const MongoClient = mongodb.MongoClient

app.use( express.urlencoded({
    extended: true})
)
app.use(express.json())

app.get('',(req,res)=> {
    res.send('NodeJS server')
})

app.get('/about',(req,res)=> {
    res.send('<h1>Server: task manager</h1>')
})

app.get('/author',(req,res)=> {
    res.send({'first name':'Heni','last name':'Stovcikova'})
})

app.get('/task', (req, res)=>{
    MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client)=>{
        if(error){
            return console.log('Unable to connect to database!')
        }
        console.log('Connection successed')
        let filter='{}';
        if(req.query.done){
            if(req.query.done=='true')
                filter = {done:true};
            else
                filter={done:false}
        }else if(req.query.priority){
            filter.priority=parseInt(req.query.priority);
            /*if(req.query.priority=='true')
                filter = {priority:true};
            else
                filter={priority:false}*/
        }
        const db = client.db(databaseName);

        db.collection('tasks').find().toArray((err, result)=> {
            if (err) throw err;
            console.log(result);
            res.send(result);
        })
        
    })
})
//insert
app.post('/task/new', (req,res)=>{
    const data = req.body;
    const name = data.name;
    const priority = data.priority;
    let price = 'undefined';
    if(data.price){
        price = data.price;
    }
    console.log(name, '',priority,'',price);
    const done = false;
    const currentdate = new Date();
    console.log(currentdate);

    if(price === undefined){
        var myobj = { Date: currentDate, Name: name, Done: done, Priority: priority};
            var MongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/";
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("taskDB");
                dbo.collection("tasks").insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  console.log("1 document inserted");
                  db.close();
                });
              });
              res.send('{"Result":"OK"}');
        }else{
            var myobj = { Date: currentDate, Name: name, Done: done, Priority: priority, Price: price};
            var MongoClient = require('mongodb').MongoClient;
            var url = "mongodb://localhost:27017/";
            MongoClient.connect(url, function(err, db) {
                if (err) throw err;
                var dbo = db.db("Task/DB");
                dbo.collection("tasks").insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  console.log("1 document inserted");
                  db.close();
                });
              });
              res.send('{"Result":"OK"}'); 
    }
})



app.listen(3000, ()=>{
    console.log('Server port is 3000')
})