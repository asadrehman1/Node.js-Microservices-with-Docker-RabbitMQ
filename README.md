# Microservices Task App

A basic microservices-based application built with **Node.js**, **RabbitMQ**, and **Docker**.  
It consists of three services:

- **User Service** → Create and manage users
- **Task Service** → Create tasks for users
- **Notification Service** → Listens for task creation events and sends async notifications using RabbitMQ

---

## 🛠 Tech Stack

- Node.js
- Express.js
- RabbitMQ (for async communication)
- Docker & Docker Compose (for containerization)

---

## 📂 Project Structure

```
/user-service
/task-service
/notification-service
docker-compose.yml

```

---

## 🚀 Getting Started

### Prerequisites

- Docker
- Docker Compose

### Installation

Clone the repository:

```bash
git clone https://github.com/asadrehman1/Node.js-Microservices-with-Docker-RabbitMQ.git
docker-compose up --build
```
