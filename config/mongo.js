const mongoose = require('mongoose');
const { env } = require('./env');

exports.connect = async () => {
    try{
        const uriMongo = `${env.uriMongo}`;
        mongoose.set('strictQuery', false);
        await mongoose.connect(uriMongo);
        console.log('MongoDB connected');
    }catch(err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Exit process with failure
    }
}