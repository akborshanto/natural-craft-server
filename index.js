const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 4000;

require('dotenv').config()
//console.log(process.env.DB_PASS)

app.use(cors());
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

 const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zqymdgy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
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
        // await client.connect();
        const craftItemCollection = client.db("CraftItems").collection("addedCraftItems");
        const categoryCollection = client.db("CraftItems").collection("subcategory_name");

        app.put('/craftItems/:id', async (req, res) => {
            const id = req.params.id;
            //console.log(id)
            const loadedcraftItem = req.body;

            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedCraftItem = {
                $set: {
                    image_url: loadedcraftItem.image_url,
                    item_name: loadedcraftItem.item_name,
                    rating: loadedcraftItem.rating,
                    subcategory_name: loadedcraftItem.subcategory_name,
                    customization: loadedcraftItem.customization,
                    stock_status: loadedcraftItem.stock_status,
                    processing_time: loadedcraftItem.processing_time,
                    short_description: loadedcraftItem.short_description,
                    user_email: loadedcraftItem.user_email,
                    user_name: loadedcraftItem.user_name,
                    price: loadedcraftItem.price,
                }
            }

            const result = await craftItemCollection.updateOne(query, updatedCraftItem, options);
            res.send(result)
        })


        app.get('/craftItems/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await craftItemCollection.findOne(query);
            res.send(result)
        })
        app.get('/mycarft/:email', async (req, res) => {
            const email = req.params.email;
            
            const query = { user_email: email }
            const result = await craftItemCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/customaize/:text', async (req, res) => {
            const email = req.params.text;
            
            const query = { customization: email }
            //console.log(query)
            const result = await craftItemCollection.find(query).toArray();
            res.send(result)
        })
        app.get('/category/:subcategory_name', async (req, res) => {
            const category = req.params.subcategory_name;
           
            const query = { subcategory_name: category }
            const result = await craftItemCollection.find(query).toArray();
            res.send(result)
        })


        app.get('/craftItems', async (req, res) => {
            const result = await craftItemCollection.find().toArray();
            res.send(result)
        })
        app.get('/subcategory_name', async (req, res) => {
            const result = await categoryCollection.find().toArray();
            res.send(result)
        })

        app.post('/craftItems', async (req, res) => {
            const craftDetails = req.body;
            //console.log(craftDetails)
            const result = await craftItemCollection.insertOne(craftDetails)
            res.send(result);
        })
        app.delete('/craftItems/:id', async (req, res) => {
            const id = req.params.id;

            const query = { _id: new ObjectId(id) };
            const result = await craftItemCollection.deleteOne(query);
            res.send(result)
        })

        app.get('/', (req, res) => {
            res.send('Hello World!')
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})