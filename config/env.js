'use strict';

require('dotenv').config();

const requiredEnvVars = [
    "URI_MONGO",
    "PORT",
    "SECRET_KEY",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY"
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Environment variable ${varName} is required but not defined.`);
    }
});

exports.env = {
    uriMongo: process.env.URI_MONGO,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY,
    firebase: {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
    }
}
