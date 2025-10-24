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
1. **Clone the repository**
git clone https://github.com/lilsea7/CRUD-basic.git
cd crud-basic/backendnpm install

2. **Install dependencies**:
npm install

3. **Configure environment variables**:
- Create a `.env` file in the `backend` directory.
- Add the following variables (replace `<your_password>` with your MongoDB Atlas password):
mongodb+srv://txinh:27102003@cluster0.v6qh4yk.mongodb.net/?appName=Cluster0
PORT=5000
- Ensure your IP is allowed in MongoDB Atlas Network Access (or use 0.0.0.0/0 for testing).

4. **Run the application**:
- Start the server in development mode:
npm run dev
- The server will run on `http://localhost:5000` and connect to MongoDB.

## API Endpoints

### Base URL
`http://localhost:5000/api/users`

### Endpoints
- **Create a User (POST)**
- URL: `/api/users`
- Method: `POST`
- Headers: `Content-Type: application/json`
- Body:
```json
{
 "name": "string",
 "email": "string",
 "age": number
}

Testing with Postman
Install Postman: Download from https://www.postman.com/downloads/.
Configure Collection:

Create a new collection (e.g., CRUD Basic).
Add a Pre-request Script:
javascriptpm.request.headers.add({ key: 'Content-Type', value: 'application/json' });

Save the collection.


Test Endpoints:

POST: Send a request with body { "name": "John Doe", "email": "john@example.com", "age": 25 }.
GET: Fetch all users or a specific user by ID.
PUT: Update a user with new data.
DELETE: Remove a user by ID.


Verify: Check responses and MongoDB Atlas (crud-basic database, users collection).
