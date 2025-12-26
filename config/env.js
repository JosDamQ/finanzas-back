'use strict';

import { config } from 'dotenv';
config();

const requiredEnvVars = [
    "URI_MONGO",
    "PORT",
    "SECRET_KEY"
];

requiredEnvVars.forEach((varName) => {
    if (!process.env[varName]) {
        throw new Error(`Environment variable ${varName} is required but not defined.`);
    }
});

export const env = {
    uriMongo: process.env.URI_MONGO,
    port: process.env.PORT,
    secretKey: process.env.SECRET_KEY
}