
'use strict';

const jwt = require('jsonwebtoken');
const { env } = require('../../config/env');

exports.verifyToken = async (req, res, next) => {
    if (!req.headers.authorization) {
        return res.status(403).json({ message: `Doesn't contain headers "AUTHORIZATION"` });
    }

    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, env.secretKey);
        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
        if (error instanceof jwt.JsonWebTokenError) {
            if (error.message === 'jwt expired') {
                return res.status(401).json({ message: 'Token expired' });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } else {
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}