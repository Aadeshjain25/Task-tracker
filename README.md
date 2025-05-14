# Task Tracker Application

A full-stack application for tracking project tasks and progress.

## Features

- User authentication (Signup/Login)
- Project management (up to 4 projects per user)
- Task management (Create, Read, Update, Delete)
- Progress tracking
- User profile management

## Tech Stack

- Frontend: React.js
- Backend: Node.js with Express
- Database: MongoDB
- Authentication: JWT

## Project Structure

```
task-tracker/
├── client/             # React frontend
├── server/             # Node.js backend
└── README.md
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/task-tracker
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm start
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- POST /api/auth/signup - Register a new user
- POST /api/auth/login - Login user

### Projects
- GET /api/projects - Get all projects for a user
- POST /api/projects - Create a new project
- GET /api/projects/:id - Get a specific project
- PUT /api/projects/:id - Update a project
- DELETE /api/projects/:id - Delete a project

### Tasks
- GET /api/tasks - Get all tasks for a project
- POST /api/tasks - Create a new task
- GET /api/tasks/:id - Get a specific task
- PUT /api/tasks/:id - Update a task
- DELETE /api/tasks/:id - Delete a task 