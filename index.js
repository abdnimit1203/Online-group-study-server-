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
    origin: ["https://collabora-task-b8a11.web.app"],
    credentials: false,
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
    // await client.connect();

    const assignmentCollection = client
      .db("collaboraTaskDB")
      .collection("assignments");
    const submittedCollection = client
      .db("collaboraTaskDB")
      .collection("submits");

    app.get("/api/v1/assignments", async (req, res) => {
      console.log(req.query.difficulty);
      let query = {};
      if (req.query?.difficulty) {
        query = { difficulty: req.query.difficulty };
      }
      if (req.query?.difficulty == "All") {
        query = {};
      }

      const cursor = assignmentCollection.find(query);
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
    // put method for updating data
    app.put("/api/v1/user/update/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      // console.log(id , updated);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAssignment = {
        $set: {
          title: updated.title,
          description: updated.description,
          marks: updated.marks,
          difficulty: updated.difficulty,
          imageURL: updated.imageURL,
          dueDate: updated.dueDate,
        },
      };
      const result = await assignmentCollection.updateOne(
        filter,
        updateAssignment,
        options
      );
      res.send(result);
    });
    //id wise assignment delete
    app.delete("/api/v1/assignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await assignmentCollection.deleteOne(query);
      res.send(result);
    });

    // submitted assignment get
    app.get("/api/v1/submitted-assignments", async (req, res) => {
      let query = {};
      if (req.query?.status) {
        query = { status: req.query?.status };
      }
      if(req.query?.email){
        query = { email: req.query?.email };
      }
      const cursor = submittedCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // submitted assignment post
    app.post("/api/v1/submitted-assignments", async (req, res) => {
      const submitData = req.body;
      const result = await submittedCollection.insertOne(submitData);
      res.send(result);
    })
     //id wise assignment get
     app.get("/api/v1/submitted-assignments/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const submits = await submittedCollection.findOne(query);
      res.send(submits);
    });
    // updating submitted data
    app.put("/api/v1/submitted/update/:id", async (req, res) => {
      const id = req.params.id;
      const updated = req.body;
      console.log(id , updated);

      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateAssignment = {
        $set: {
          status: updated.status,
          marksObtained: updated.marksObtained,
          feedback: updated.feedback
        }
      };
      const result = await submittedCollection.updateOne(
        filter,
        updateAssignment,
        options
      );
      res.send(result);
    });








    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
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
