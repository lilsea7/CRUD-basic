# CRUD Basic Project

A simple backend CRUD (Create, Read, Update, Delete) application built with Node.js, Express, and MongoDB. This project serves as a foundation for managing user data and can be tested using tools like Postman.

## Tech Stack
- **Backend**: Node.js, Express
- **Database**: MongoDB (via Mongoose)
- **Tools**: ESLint, Prettier, Nodemon
- **Testing**: Postman

## Project Overview
This project provides a RESTful API for basic CRUD operations on a `users` collection in MongoDB. It includes features like input validation, error handling, and automatic timestamps for created/updated records.

### Prerequisites
- Node.js (version >= 14)
- npm (usually comes with Node.js)
- MongoDB Atlas account (for remote database)
- Postman (for API testing)

### Installation
1. **Clone the repository** (or create manually):
git clone <your-repo-url> crud-basic
cd crud-basic/backend
*Note*: If not using Git, manually create the `backend` folder and add files as described.

3. **Install dependencies**:
npm install
text3. **Configure environment variables**:
- Create a `.env` file in the `backend` directory.
- Add the following variables:
MONGO_URI=mongodb+srv://txinh:<your_password>@ac-cw8mpv6-shard-00-00.v6qh4yk.mongodb.net/crud-basic?appName=Cluster0
PORT=5000
- Ensure your IP is allowed in MongoDB Atlas Network Access (or use 0.0.0.0/0 for testing).

4. **Run the application**:
- Start the server in development mode:
npm run dev
text- The server will run on `http://localhost:5000` and connect to MongoDB.

## API Endpoints

### Base URL
`http://localhost:5000/api/users`


## Testing with Postman

Install Postman: Download from https://www.postman.com/downloads/.
Configure Collection:

Create a new collection (e.g., CRUD Basic).
Add a Pre-request Script:
javascriptpm.request.headers.add({ key: 'Content-Type', value: 'application/json' });

Save the collection.


**Test Endpoints:**

- POST: Send a request with body { "name": "txinh", "email": "txinh@gmail.com", "age": 22 }.
- GET: Fetch all users or a specific user by ID.
- PUT: Update a user with new data.
- DELETE: Remove a user by ID.


Verify: Check responses and MongoDB Atlas (crud-basic database, users collection).
