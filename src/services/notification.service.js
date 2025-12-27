'use strict';

const admin = require('../../config/firebase');

exports.sendNotification = async (fcmToken, title, body, data = {}) => {
    try {
        if (!fcmToken) return;

        const message = {
            notification: {
                title,
                body
            },
            data,
            token: fcmToken
        };

        await admin.messaging().send(message);
        console.log(`Notification sent to ${fcmToken}`);
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

exports.sendNotificationToUser = async (user, title, body, data = {}) => {
    if (user && user.fcmToken) {
        await this.sendNotification(user.fcmToken, title, body, data);
    }
};
