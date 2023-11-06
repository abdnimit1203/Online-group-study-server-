const express = require("express");
const cors = require("cors");
require("dotenv").config();
const assigments = require("./dummy.json");
const app = express();
const port = process.env.PORT || 3000;

// middleware

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.SECRET_USER}:${process.env.SECRET_PASSWORD}@cluster0.di78vms.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const assignmentCollection = client
      .db("collaboraTaskDB")
      .collection("assignments");

    app.get("/api/v1/assignments", async (req, res) => {
      const cursor = assignmentCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //id wise assignment get
    app.get("/api/v1/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const assignment = await assignmentCollection.findOne(query);
      res.send(assignment);
    });
    app.post("/api/v1/user/create-assignment", async (req, res) => {
      const assigmentsData = req.body;
      const result = await assignmentCollection.insertOne(assigmentsData);
      res.send(result);
    });
    //id wise assignment delete
    app.delete("/api/v1/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await assignmentCollection.deleteOne(query);
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
  res.send("Collabora Task server is running...");
});

app.get("/assignments", (req, res) => {
  res.send(assigments);
});
// id wise assignment
app.get("/assignments/:id", (req, res) => {
  const id = parseInt(req.params.id);
  console.log(id);
  const assignment =
    assigments.find((assignment) => assignment.id === id) || {};
  res.send(assignment);
});

app.listen(port, () => {
  console.log(`CollaboraTask server running on PORT: ${port}`);
});
