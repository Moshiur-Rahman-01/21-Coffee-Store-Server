const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Create a MongoClient with a MongoClientOptions object to set the Stable API version 
const client = new MongoClient(process.env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    } 
});
async function run() {
    try {
        const coffeesCollection = client.db('coffeeDB').collection('coffees');
        const usersCollection = client.db('coffeeDB').collection('users');

        app.get('/coffees', async(req, res) => {
            // const cursor = coffeesCollection.find();
            // const result = await cursor.toArray();
            const result = await coffeesCollection.find().toArray();
            res.send(result);
        })

        app.get('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await coffeesCollection.findOne(query);
            res.send(result);
        })

        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            console.log(newCoffee);
            const result = await coffeesCollection.insertOne(newCoffee);
            res.send(result);
        })

        // data gulo update korar jonne
        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id)}
            const options = {upsert: true};
            const updatedCoffee = req.body;
            // const updatedDoc = {
            //     $set: {
            //         name: updatedCoffee.name,
            //         price: updatedCoffee.price,
            //         ---------------------------
            //     }
            // }
            const updatedDoc = {
                $set: updatedCoffee
            }
            const result = await coffeesCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })

        app.delete('/coffees/:id', async(req,res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await coffeesCollection.deleteOne(query);
            res.send(result);
        })


        // DBMS
        // User related APIs
        app.get('/users', async(req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const newUser = req.body;
            console.log(newUser);
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        })

        // shudhu ekta field er data update korar jonne
        app.patch('/users', async(req, res) => {
            console.log(req.body);
            const {email, lastSignInTime} = req.body;
            const filter = {email: email}
            const updatedDoc = {
                $set: {
                    lastSignInTime: lastSignInTime
                }
            }
            const result = await usersCollection.updateOne(filter, updatedDoc)
            res.send(result)
        })

        app.delete('/users/:id', async(req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id)}
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Coffee server is getting hotter.');
})

app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`)
})
