const admin = require('firebase-admin');
const { env } = require('./env');

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: env.firebase.projectId,
        clientEmail: env.firebase.clientEmail,
        privateKey: env.firebase.privateKey,
    }),
});

module.exports = admin;
