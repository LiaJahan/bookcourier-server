const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ykbni5d.mongodb.net/?appName=Cluster0`;
const uri = process.env.DB_URI;


const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const database = client.db("bookCourierDB");

    const usersCollection =
      database.collection("users");

    app.get("/", (req, res) => {
      res.send("BookCourier Server Running");
    });

    app.get("/users", async (req, res) => {
      const result =
        await usersCollection.find().toArray();

      res.send(result);
    });

    await client.db("admin").command({
      ping: 1,
    });

    console.log(
      "Successfully connected to MongoDB!"
    );
  } finally {
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});