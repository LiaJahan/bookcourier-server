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
    const ordersCollection =
  database.collection("orders");

    const booksCollection =
  database.collection("books");  

  app.post("/books", async (req, res) => {
  const book = req.body;

  const result =
    await booksCollection.insertOne(book);

  res.send(result);
});


app.post("/orders", async (req, res) => {
  const order = req.body;

  const result =
    await ordersCollection.insertOne(
      order
    );

  res.send(result);
});

app.get("/orders/:email", async (req, res) => {
  const email = req.params.email;

  const query = {
    userEmail: email,
  };

  const result =
    await ordersCollection
      .find(query)
      .toArray();

  res.send(result);
});


app.patch(
  "/orders/cancel/:id",
  async (req, res) => {
    const id = req.params.id;

    const query = {
      _id: new ObjectId(id),
    };

    const updateDoc = {
      $set: {
        orderStatus:
          "cancelled",
      },
    };

    const result =
      await ordersCollection.updateOne(
        query,
        updateDoc
      );

    res.send(result);
  }
);


app.patch("/orders/pay/:id", async (req, res) => {
  const id = req.params.id;

  const paymentId =
    "PAY-" +
    Date.now() +
    Math.floor(
      Math.random() * 1000
    );

  const query = {
    _id: new ObjectId(id),
  };

  const updateDoc = {
    $set: {
      paymentStatus: "paid",
      paymentId,
      paymentDate: new Date(),
    },
  };

  const result =
    await ordersCollection.updateOne(
      query,
      updateDoc
    );

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


app.get("/books/:id", async (req, res) => {
  const id = req.params.id;

  const query = {
    _id: new ObjectId(id),
  };

  const result =
    await booksCollection.findOne(query);

  res.send(result);
});

app.patch("/books/:id", async (req, res) => {
  const id = req.params.id;

  const updatedBook = req.body;

  const query = {
    _id: new ObjectId(id),
  };

  const updateDoc = {
    $set: {
      title: updatedBook.title,
      author: updatedBook.author,
      category: updatedBook.category,
      description:
        updatedBook.description,
      price: updatedBook.price,
      status: updatedBook.status,
    },
  };

  const result =
    await booksCollection.updateOne(
      query,
      updateDoc
    );

  res.send(result);
});

// another this one
app.get("/books", async (req, res) => {
  const query = {
    status: "published",
  };

  const result =
    await booksCollection.find(query).toArray();

  res.send(result);
});

// one is this one ------

// app.get("/books", async (req, res) => {
//   const result =
//     await booksCollection.find().toArray();

//   res.send(result);
// });
   

// admin getting all books
app.get("/all-books", async (req, res) => {
  const result =
    await booksCollection.find().toArray();

  res.send(result);
});


// users wishlist
const wishlistCollection =
  database.collection("wishlist");

app.post("/wishlist", async (req, res) => {
  const wishlistItem = req.body;

  const existingItem =
    await wishlistCollection.findOne({
      userEmail:
        wishlistItem.userEmail,
      bookId:
        wishlistItem.bookId,
    });

  if (existingItem) {
    return res.send({
      message:
        "already exists",
      insertedId: null,
    });
  }

  const result =
    await wishlistCollection.insertOne(
      wishlistItem
    );

  res.send(result);
});

// get wishlist
app.get(
  "/wishlist/:email",
  async (req, res) => {
    const email =
      req.params.email;

    const query = {
      userEmail: email,
    };

    const result =
      await wishlistCollection
        .find(query)
        .toArray();

    res.send(result);
  }
);

// remove wishlist items
app.delete(
  "/wishlist/:id",
  async (req, res) => {
    const id = req.params.id;

    const query = {
      _id: new ObjectId(id),
    };

    const result =
      await wishlistCollection.deleteOne(
        query
      );

    res.send(result);
  }
);

app.patch(
  "/orders/status/:id",
  async (req, res) => {
    const id = req.params.id;

    const { status } = req.body;

    const query = {
      _id: new ObjectId(id),
    };

    const updateDoc = {
      $set: {
        orderStatus: status,
      },
    };

    const result =
      await ordersCollection.updateOne(
        query,
        updateDoc
      );

    res.send(result);
  }
);

app.get(
  "/librarian-orders/:email",
  async (req, res) => {
    const email = req.params.email;

    const query = {
      librarianEmail: email,
    };

    const result =
      await ordersCollection
        .find(query)
        .toArray();

    res.send(result);
  }
);

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