const express = require('express');
const cors = require('cors');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const app = express();

app.use(express.json());
app.use(cors());

// Mongo database set up

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.wrvum.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const prodcuctCollection = client.db("emaJohn").collection("products");
    const ordersCollection = client.db("emaJohn").collection("orders");

    app.post('/addProduct', (req, res) => {
        const products = req.body;
        prodcuctCollection.insertOne(products)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount);
            });
    });

    app.get('/products', (req, res) => {
        prodcuctCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.get('/product/:key', (req, res) => {
        const productKey = req.params.key;
        prodcuctCollection.find({ key: productKey })
            .toArray((err, documents) => {
                res.send(documents[0]);
            })
    });

    app.post('/productsByKeys', (req, res) => {
        const productKeys = req.body;
        prodcuctCollection.find({ key: { $in: productKeys } })
            .toArray((err, documents) => {
                res.send(documents);
            })
    });

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                console.log(result.insertedCount);
                res.send(result.insertedCount > 0);
            });
    });


    // client.close();

});


app.get('/', (req, res) => {
    res.send('Homepage loaded');
});

app.listen(4200);