const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    // await client.connect();

    // newBrands 6 Cards
    const newBrandCollection = client
      .db("technology_brands")
      .collection("newBrands");

    const  newProductCollection = client
      .db("technology_brands")
      .collection("productList");

    const  newProductUpdateCollection = client
      .db("technology_brands")
      .collection("products");

    const userCollection = client
      .db("technology_brands")
      .collection("user");

    // Main 6 types data
    app.get("/newBrands", async (req, res) => {
      const cursor = newBrandCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });


    // ---------------------------------------

      // 4 product get 
    app.get("/productList", async (req, res) => {
      const cursor = newProductCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    // 4 product details
    app.get("/productList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await newProductCollection.findOne(query)
      res.send(result)
    });

    // get update single product 
    app.get('/products/:id', async(req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await newProductUpdateCollection.findOne(query);
      res.send(result);
    })

    // new product added 
    app.post('/products', async(req, res)=> {
      const newProducts = req.body;
      const result = await newProductUpdateCollection.insertOne(newProducts);
      res.send(result)
    })

    // new product ui show 
    app.get('/products', async(req, res)=> {
      const cursor = newProductUpdateCollection.find();
      const result = await cursor.toArray();
      res.send(result)
    })
 

    // update product 
    app.put("/products/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedProduct = req.body;
      const product = {
        $set: {
          name: updatedProduct.name,
          image: updatedProduct.image,
          brandName: updatedProduct.brandName,
          category: updatedProduct.category,
          price: updatedProduct.price,
          description: updatedProduct.description,
        },
      };
      const result = await newProductUpdateCollection.updateOne(
        filter,
        product,
        options
      );
      res.send(result);
    });


    // delete product 
    app.delete('/products/:id', async (req, res)=> {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)}
      const result = await newProductUpdateCollection.deleteOne(query);
      res.send(result)
    })


    // user related
    app.get("/user", async (req, res) => {
      const cursor = userCollection.find();
      const user = await cursor.toArray();
      res.send(user);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

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