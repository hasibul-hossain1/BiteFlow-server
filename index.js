const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const admin = require("firebase-admin");

const decoded=Buffer.from(process.env.SERVICE_ACCOUNT_KEY,'base64').toString('utf8')
const serviceAccount = JSON.parse(decoded)



admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: ["http://localhost:5173","https://flow-bite.netlify.app"],
    credentials: true,
  })
);

app.use(cookieParser());
const port = process.env.PORT || 3030;

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.post("/login", async (req, res) => {
  const { idToken } = req.body;
  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const sessionUser = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    res.cookie("session", JSON.stringify(sessionUser), {
      httpOnly: true,
      secure: true,
      sameSite:'none'
    });

    res.json({ message: "Logged in successfully" });
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.post("/logout", (req, res) => {
  res.clearCookie("session", {
    httpOnly: true,
    path:"/",
    secure: true,
    sameSite:"none"
  });
  res.json({ message: "Logged out successfully" });
});

const verifySession = (req, res, next) => {
  const sessionCookie = req.cookies.session;
  if (!sessionCookie) return res.status(401).json({ message: "Unauthorized" });

  try {
    const user = JSON.parse(sessionCookie);
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid session" });
  }
};

const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.PASS}@cluster0.f1kjav4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const purchase = client.db("foods_db").collection("purchase");

    app.get("/foods", async (req, res) => {
      const result = await foods.find().toArray();
      res.send(result);
    });

    app.post("/purchase",verifySession, async (req, res) => {
      //add item to purchase collection
      const selectedItem = req.body;
      const purchaseResult = await purchase.insertOne(selectedItem);
      //update purchase count in foods collection
      const purchaseCount = selectedItem.quantity;
      const query = { _id: new ObjectId(selectedItem.foodId) };
      const updatedDoc = { $inc: { purchaseCount, quantity: -purchaseCount } };
      const updateResult = await foods.updateOne(query, updatedDoc);
      res.send({ purchaseResult, updateResult });
    });
    app.get("/myfoods", verifySession, async (req, res) => {
      const email = req.query.email;
      if (req.user.email !== email)
        return res.status(401).json({ message: "Unauthorized" });
      const query = { "addedBy.email": email };
      const result = await foods.find(query).toArray();
      res.send(result);
    });

    app.get("/myorders", verifySession, async (req, res) => {
      const email = req.query.email;
      if (req.user.email !== email)
        return res.status(401).json({ message: "Unauthorized" });
      const query = { buyerEmail: email };
      const result = await purchase.find(query).toArray();
      res.send(result);
    });

    app.post("/newfood",verifySession, async (req, res) => {
      const newFood = req.body;
      const result = await foods.insertOne(newFood);
      res.send(result);
    });

    app.delete("/myfoods/:id",verifySession, async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await foods.deleteOne(query);
      res.send(result);
    });

    app.delete("/myorders/:id",verifySession, async (req, res) => {
      //deleteItem
      const query = { _id: new ObjectId(req.params.id) };
      const deleteResult = await purchase.deleteOne(query);
      //update quantity
      const foodId=req.query.foodId
      const quantity=+req.query.quantity
      const foodQuery={_id:new ObjectId(foodId)}
      const updateDoc={
        $inc:{
          purchaseCount:-quantity, quantity 
        }
      }
      const updateFoodResult=foods.updateOne(foodQuery,updateDoc)
      res.send(deleteResult,updateFoodResult);
    });
    
    app.put("/updatefood/:id",verifySession, async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const updateDoc = { $set: req.body };
      const result = await foods.updateOne(query, updateDoc);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("http://localhost:" + port);
});
