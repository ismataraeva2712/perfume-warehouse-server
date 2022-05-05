const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express()
// middleware

app.use(cors())
app.use(express.json())

// database connection 


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ae6v8.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect()
        const itemCollection = client.db('perfume').collection('item')
        app.get('/items', async (req, res) => {
            const query = {};
            const cursor = itemCollection.find(query)
            const items = await cursor.toArray()
            res.send(items)
        })
        app.get('/items/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: ObjectId(id) }
            const item = await itemCollection.findOne(query)
            res.send(item)
        })
        // update quantity
        app.put('/items/:id', async (req, res) => {
            const id = req.params.id
            const updatedQuantity = req.body
            console.log(updatedQuantity)
            const query = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    quantity: updatedQuantity.quantity
                }
            }
            const result = await itemCollection.updateOne(query, updateDoc, options)

            res.send(result)
        })
    }
    finally {

    }

}
run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('running server')
})

app.listen(port, () => {
    console.log('listening port', port)
})