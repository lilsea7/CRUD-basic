const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));

app.get('/', (req, res) => {
  res.send('API CRUD + Auth is running');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});