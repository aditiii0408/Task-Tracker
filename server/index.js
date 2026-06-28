const express = require("express");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const url = process.env.MONGODB_URL;
console.log(process.env.MONGODB_URL);

const client = new MongoClient(url);

client.connect()
.then(() => {
    console.log("Connected to Atlas");
})
.catch(err => {
    console.log(err);
});

// GET all tasks
app.get("/tasks", (req, res) =>
{
    const db = client.db("tasktracker");
    const coll = db.collection("tasks");
    coll.find().toArray()
    .then(response =>
    {
        res.send(response);
    })
    .catch(error =>
    {
        console.log("issue " + error);
    });
});

// POST create task
app.post("/tasks", (req, res) =>
{
    const db = client.db("tasktracker");
    const coll = db.collection("tasks");
    const doc = {
        "title": req.body.title,
        "description": req.body.description,
        "status": req.body.status,
        "dueDate": req.body.dueDate
    };
    coll.insertOne(doc)
    .then(response =>
    {
        console.log(response);
        res.send(response);
    })
    .catch(error =>
    {
        console.log("issue " + error);
    });
});

// PUT update task
app.put("/tasks/:id", (req, res) =>
{
    const db = client.db("tasktracker");
    const coll = db.collection("tasks");
    const filter = { "_id": new ObjectId(req.params.id) };
    const update = {
        $set: {
            "title": req.body.title,
            "description": req.body.description,
            "status": req.body.status,
            "dueDate": req.body.dueDate
        }
    };
    coll.updateOne(filter, update)
    .then(response =>
    {
        res.send(response);
    })
    .catch(error =>
    {
        console.log("issue " + error);
    });
});

// DELETE task
app.delete("/tasks/:id", (req, res) =>
{
    const db = client.db("tasktracker");
    const coll = db.collection("tasks");
    const filter = { "_id": new ObjectId(req.params.id) };
    coll.deleteOne(filter)
    .then(response =>
    {
        res.send(response);
    })
    .catch(error =>
    {
        console.log("issue " + error);
    });
});

app.listen(9000, () => { console.log("ready to serve @9000"); });