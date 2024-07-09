const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const port = process.env.PORT || 5000;


// Middleware \\
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@wizardingcraft.wnq8tai.mongodb.net/?appName=WizardingCraft`

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const craftsCollection = client.db('crafts').collection('crafts')

        // Add a craft \\
        app.post('/crafts', async (req, res) => {
            const craft = req.body;
            const result = await craftsCollection.insertOne(craft)
            res.send(result)
        })

        // Get all crafts \\
        app.get('/crafts', async (req, res) => {
            const cursor = craftsCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })

        // Get a craft \\
        app.get('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const result = await craftsCollection.findOne({ _id: new ObjectId(id) });
            res.send(result)
        })

        // Get user's cafts\\
        app.get('/crafts/:email', async (req, res) => {
            const email = req.params.email;
            const cursor = await craftsCollection.find({ userEmail: email })
            const result = await cursor.toArray()
            res.send(result)
        })

        // Update a craft \\
        app.patch('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true }
            const craft = req.body;
            const updatedCraft = {
                $set: {
                    name: craft.name,
                    imageURL: craft.imageURL,
                    subcategory: craft.subcategory,
                    description: craft.description,
                    price: craft.price,
                    rating: craft.rating,
                    customization: craft.customization,
                    processingTime: craft.processingTime,
                    stockStatus: craft.stockStatus,
                    userEmail: craft.userEmail,
                    userName: craft.userName,
                }
            }
            const result = await craftsCollection.updateOne(filter, updatedCraft, options);
            res.send(result)
        })

        // Remove a craft \\
        app.delete('/craft/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await craftsCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally { }
}
run()
    .catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Crafting server is running')
})

app.listen(port, () => {
    console.log(`Crafting server is running on port: ${port}`)
})