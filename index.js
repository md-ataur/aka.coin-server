const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const app = express();
const port = process.env.PORT || 5000;

/**
 * Middleware functions
 */
app.use(cors());
app.use(express.json());


/**
 * Database Connection
 */
const uri = "mongodb+srv://dbuser1:9P2AGUUElq70TuhK@cluster0.juclx.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db("myDBStore");
        const heroCollection = database.collection("hero");
        const walletCollection = database.collection("wallet");

        // POST API to add hero
        app.post('/hero', async (req, res) => {
            const hero = req.body;
            const result = await heroCollection.insertOne(hero);
            res.json(result);
        });

        // GET API to get data
        app.get('/hero', async (req, res) => {
            const cursor = heroCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET API to get single data by id
        app.get('/hero/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const data = await heroCollection.findOne(query);
            res.send(data);
        });

        // PUT API to update data
        app.put('/hero/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateData.title,
                    subtitle: updateData.subtitle,
                    image: updateData.image
                },
            };
            const result = await heroCollection.updateOne(query, updateDoc, options);
            res.json(result)
        });

        // DELETE API to delete data
        app.delete('/hero/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await heroCollection.deleteOne(query);
            res.json(result);
        });

        // POST API to add wallet
        app.post('/wallet', async (req, res) => {
            const wallet = req.body;
            const result = await walletCollection.insertOne(wallet);
            res.json(result);
        });

        // GET API to get data
        app.get('/wallet', async (req, res) => {
            const cursor = walletCollection.find({});
            const result = await cursor.toArray();
            res.send(result);
        });

        // GET API to get single data by id
        app.get('/wallet/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const data = await walletCollection.findOne(query);
            res.send(data);
        });

        // PUT API to update data
        app.put('/wallet/:id', async (req, res) => {
            const id = req.params.id;
            const updateData = req.body;
            const query = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    title: updateData.title,
                    imageIcon: updateData.imageIcon,
                    description: updateData.description,
                    bgImage: updateData.bgImage,
                    color: updateData.color
                },
            };
            const result = await walletCollection.updateOne(query, updateDoc, options);
            res.json(result)
        });

        // DELETE API to delete data
        app.delete('/wallet/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await walletCollection.deleteOne(query);
            res.json(result);
        });

        // console.log('Successfully database connected');
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Server is running');
});

app.listen(port, () => {
    console.log('Listening at', port);
});