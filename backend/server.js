// server.js
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const db = require('./db'); // initialize DB
const productsRouter = require('./routes/products');
const authRouter = require('./routes/auth');
const authMiddleware = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 4000;

// middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// serve uploads folder statically for images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// public auth routes
app.use('/api/auth', authRouter);

// protect product routes with JWT
app.use('/api/products', authMiddleware, productsRouter);

// basic health
app.get('/api/health', (req, res) => res.json({ status: 'ok', now: new Date().toISOString() }));

app.listen(PORT, () => {
  console.log(`Inventory backend running at http://localhost:${PORT}`);
});
