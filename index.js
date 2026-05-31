const express = require("express");
const cors = require("cors");
require("dotenv").config();


const {
  MongoClient,
  ServerApiVersion,
  ObjectId,
} = require("mongodb");

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

    const booksCollection =
  database.collection("books");  
app.post("/books", async (req, res) => {
  const book = req.body;

  const result =
    await booksCollection.insertOne(book);

  res.send(result);
});

app.get("/books/librarian/:email", async (req, res) => {
  const email = req.params.email;

  const query = {
    librarianEmail: email,
  };

  const result =
    await booksCollection.find(query).toArray();

  res.send(result);
});

app.get("/books/librarian/:email", async (req, res) => {
  const email = req.params.email;

  const query = {
    librarianEmail: email,
  };

  const result =
    await booksCollection.find(query).toArray();

  res.send(result);
});

app.get("/books", async (req, res) => {
  const result =
    await booksCollection.find().toArray();

  res.send(result);
});
    app.post("/users", async (req, res) => {
  const user = req.body;

  const existingUser = await usersCollection.findOne({
    email: user.email,
  });

  if (existingUser) {
    return res.send({
      message: "user already exists",
      insertedId: null,
    });
  }

  const result = await usersCollection.insertOne(user);

  res.send(result);
});  
app.patch(
  "/users/librarian/:id",
  async (req, res) => {
    const id = req.params.id;

    const query = {
      _id: new ObjectId(id),
    };

    const updateDoc = {
      $set: {
        role: "librarian",
      },
    };

    const result =
      await usersCollection.updateOne(
        query,
        updateDoc
      );

    res.send(result);
  }
);
app.patch("/users/admin/:id", async (req, res) => {
  const id = req.params.id;

  const query = {
    _id: new ObjectId(id),
  };

  const updateDoc = {
    $set: {
      role: "admin",
    },
  };

  const result =
    await usersCollection.updateOne(
      query,
      updateDoc
    );

  res.send(result);
});

    app.get("/", (req, res) => {
      res.send("BookCourier Server Running");
    });

    
      app.get("/users/role/:email", async (req, res) => {
  const email = req.params.email;

  const user = await usersCollection.findOne({
    email,
  });

  if (!user) {
    return res.send({
      role: null,
    });
  }

  res.send({
    role: user.role,
  });
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