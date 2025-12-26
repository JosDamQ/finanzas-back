'use strict';

const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');

exports.generateToken = async (data) => {
    try {
        const payload = {
            id: data._id,
            email: data.email,
            //role: data.role,
        }
        const options = {
            expiresIn: '2h',
        }
        const token = jwt.sign(payload, env.secretKey, options);
        return token;
    } catch (error) {
        console.log(error);
        return error;
    }
}