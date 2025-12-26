const mongoose = require('mongoose');
const { env } = require('./env');

exports.connect = async (req, res, next) => {
    try{
        const uriMongo = `${env.uriMongo}`;
        mongoose.set('strictQuery', false);
        await mongoose.connect(uriMongo);
        console.log('MongoDB connected');
    }catch(err) {
        console.log(err);
        next(err);
    }
}