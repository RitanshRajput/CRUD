const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/testDB")
  .then(() => console.log(" MongoDB is connected✅"))
  .catch((err) =>
    console.log("🔴 Mongoose is Not working and the reason is : ", err)
  );

const ItemSchema = mongoose.Schema({
  name: String,
});

const Items = mongoose.model("Items", ItemSchema);

// API....
app.post("/items", async (req, res) => {
  try {
    const newItem = new Items(req.body);
    await newItem.save();
    res.status(200).send(newItem);
  } catch (err) {
    res.status(500).send(erro);
  }
});

app.get("/items", async (req, res) => {
  try {
    const items = await Items.find();
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.put("/items/:id", async (req, res) => {
  try {
    const items = await Items.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!items) {
      res.status(500).send({ message: "Items is not found" });
    }
    res.status(200).send(items);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete("/items/:id", async (req, res) => {
  try {
    await Items.findByIdAndDelete(req.params.id);
    res.status(200).send({ message: "Item deleted Successfully" });
  } catch (err) {
    res.status(500).send(err);
  }
});

//PORT
const PORT = 5000;

app.listen(PORT, () => {
  console.log("Server is RUNNING on PORT : ", PORT);
});
