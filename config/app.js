'use strict';
const { env } = require('../config/env');

const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const app = express();
const port = env.port || 3200;

// import routes
/* 
const userRoutes = require('../routes/userRoutes');
const productRoutes = require('../routes/productRoutes');
*/
const userRoutes = require('../src/modules/users/users.routes');

// Config server
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(morgan('dev'));
app.use(helmet());
app.use(cors());

// Set up routes
/* 
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
*/
app.use('/api/v1/users', userRoutes);

// Test route
app.post('/', (req, res) => {
    res.send('API is working');
});
// Start server
exports.initSever = () => {
    app.listen(port);
    console.log(`Server is running on port ${port}`);
}