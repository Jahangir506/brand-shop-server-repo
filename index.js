const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();

const port = process.env.PORT || 5007;

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.mongoDB_PASS}@cluster0.a8blzbt.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandsCollection = client.db('technology_brands').collection('brands')
    const productCollection = client.db("productDB").collection('product')
    const userCollection = client.db('brandsDB').collection('user');

    app.get('/brands', async (req, res)=>{
      const cursor = brandsCollection.find();
      const brands = await cursor.toArray();
      res.send(brands)
    })

    app.get('/brand', async(req, res)=> {
      const cursor = productCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })

    app.post('/brand', async(req, res)=> {
      const newBrand = req.body;
      console.log(newBrand);
      const result = await productCollection.insertOne(newBrand)
      res.send(result)
    })

    // user related 
    app.get('/user', async(req, res)=> {
      const cursor = userCollection.find();
      const user = await cursor.toArray();
      res.send(user)
    })

    app.post('/user', async(req, res)=>{
        const user = req.body;
        const result = await userCollection.insertOne(user);
        res.send(result)
    })


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("brand shop server is running");
});

app.listen(port, () => {
  console.log(`brand shop server is running port, ${port}`);
});
