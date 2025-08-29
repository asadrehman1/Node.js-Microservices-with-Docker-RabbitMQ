import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/users').then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.log("MongoDB connection error: " + err);
// });

mongoose
  .connect("mongodb://mongo:27017/users")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error: " + err);
  });

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});

const User = mongoose.model('User', userSchema);

app.post("/users", async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.error("Error creating user: " + error);
        res.status(500).json({ error: "Error creating user" });
    }
});

app.get("/users", async(req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users: " + error);
        res.status(500).json({ error: "Error fetching users" });
    }
});

app.listen(PORT, () => {
  console.log(`User Service is running on port ${PORT}`);
});