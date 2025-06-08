const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = "mongodb://localhost:27017/"

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.PORT || 3030;

app.get("/", (req, res) => {
  res.send("Hello World");
});

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const foods = client.db("foods_db").collection("foods");
    const purchase=client.db('foods_db').collection('purchase')

    app.get('/foods', async (req,res) => {
        const result=await foods.find().toArray()
        res.send(result)
    })
    app.post('/purchase',async (req,res) => {
      const result=await purchase.insertOne(req.body)
      res.send(result)
    })
    app.get('/myfoods',async (req,res) => {
      const email=req.query.email
      const query={"addedBy.email":email}
      const result=await foods.find(query).toArray()
      res.send(result)
    })

    app.get('/myorders',async (req,res) => {
      const email=req.query.email
      const query={buyerEmail:email}
      const result=await purchase.find(query).toArray()
      res.send(result)
    })

    app.post('/newfood',async (req,res) => {
      const newFood=req.body
      const result=await foods.insertOne(newFood)
      res.send(result)
    })
    app.delete('/myfoods/:id',async(req,res) => {
      const query={_id:new ObjectId(req.params.id)}
      const result=await foods.deleteOne(query)
      console.log(result);
      res.send(result)
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port,() => {
  console.log('http://localhost:'+port);
})