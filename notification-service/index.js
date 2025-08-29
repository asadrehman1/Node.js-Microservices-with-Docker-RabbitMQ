import amqplib from "amqplib";

let channel, connection;

const start = async () => {
  try {
    connection = await amqplib.connect("amqp://rabbitmq:5672");
    channel = await connection.createChannel();
    await channel.assertQueue("task-created");
    console.log("Notificiation Service is listening to Messages.");

    channel.consume("task-created", (message) => {
      const task = JSON.parse(message.content.toString());
      console.log("Notification: New Task: ", task.title);
      channel.ack(message);
    });
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
  }
};

start();