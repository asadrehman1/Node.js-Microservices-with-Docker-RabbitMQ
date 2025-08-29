import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import amqplib from 'amqplib';

const app = express();
const PORT = 5001;

app.use(bodyParser.json());

// mongoose.connect('mongodb://localhost:27017/tasks').then(() => {
//     console.log('Connected to MongoDB');
// }).catch((err) => {
//     console.log("MongoDB connection error: " + err);
// });

mongoose
  .connect("mongodb://mongo:27017/tasks")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("MongoDB connection error: " + err);
  });

const taskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model('Task', taskSchema);

let channel, connection;

const connectToRabbitMQWithRetry = async (retries = 5 , delay = 3000) => {
    while(retries > 0) {
        try {
            connection = await amqplib.connect('amqp://rabbitmq:5672');
            channel = await connection.createChannel();
            await channel.assertQueue('task-created');
            console.log('Connected to RabbitMQ');
            return;
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            retries--;
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
};

app.post("/tasks", async(req, res) => {
    const { title, description, userId } = req.body;
    try {
        const task = new Task({ title, description, userId });
        await task.save();

        const message = {
          taskId: task._id,
          title,
          userId
        };

        if(!channel) {
          return res.status(503).json({ error: "Error creating task" });
        }
        channel.sendToQueue("task-created", Buffer.from(JSON.stringify(message)));
        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task: " + error);
        res.status(500).json({ error: "Error creating task" });
    }
});

app.post("/tasks", async(req, res) => {
    const { title, description, userId } = req.body;
    try {
        const task = new Task({ title, description, userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.error("Error creating task: " + error);
        res.status(500).json({ error: "Error creating task" });
    }
});

app.get("/tasks", async(req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.error("Error fetching tasks: " + error);
        res.status(500).json({ error: "Error fetching tasks" });
    }
});

app.listen(PORT, () => {
  console.log(`Task Service is running on port ${PORT}`);
  connectToRabbitMQWithRetry();
});