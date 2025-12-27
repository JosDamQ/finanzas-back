'use strict';

const cron = require('node-cron');
const moment = require('moment');
const UserModel = require('../modules/users/users.model');
const CreditCardModel = require('../modules/creditCards/models/creditCard.model');
const notificationService = require('./notification.service');

exports.initScheduledJobs = () => {
    // Job 1: Monthly Budget Reminder (1st day of month at 9:00 AM)
    cron.schedule('0 9 1 * *', async () => {
        console.log('Running Monthly Budget Reminder Job');
        try {
            const users = await UserModel.find({ fcmToken: { $ne: null } });
            users.forEach(user => {
                notificationService.sendNotificationToUser(
                    user,
                    '¡Nuevo Mes, Nuevo Presupuesto!',
                    'Es hora de organizar tus finanzas. Entra y crea tu presupuesto de este mes.',
                    { type: 'budget_reminder' }
                );
            });
        } catch (error) {
            console.error('Error in Budget Reminder Job:', error);
        }
    });

    // Job 2: Credit Card Payment Reminder (Daily at 9:00 AM)
    cron.schedule('0 9 * * *', async () => {
        console.log('Running Credit Card Payment Reminder Job');
        try {
            // Check for payments due in 3 days
            const targetDate = moment().add(3, 'days');
            const targetDay = targetDate.date();
            const daysInMonth = targetDate.daysInMonth();

            // Logic:
            // 1. If targetDay is a normal day (e.g., 15), find cards with paymentDay == 15.
            // 2. If targetDay is the LAST day of the month (e.g., Feb 28 or Apr 30),
            //    we must also notify cards with paymentDay > targetDay (e.g., 29, 30, 31),
            //    because those dates don't exist this month, so the bank moves the payment to the last day.
            
            let query = { paymentDay: targetDay };

            if (targetDay === daysInMonth) {
                // It's the last day of the month, include larger days
                query = { paymentDay: { $gte: targetDay } };
            }

            const cards = await CreditCardModel.find(query).populate('user');
            
            cards.forEach(card => {
                if (card.user && card.user.fcmToken) {
                    notificationService.sendNotificationToUser(
                        card.user,
                        'Recordatorio de Pago',
                        `Tu tarjeta "${card.name}" está próxima a vencer. ¡Evita recargos!`,
                        { type: 'payment_reminder', cardId: card._id.toString() }
                    );
                }
            });

        } catch (error) {
            console.error('Error in Payment Reminder Job:', error);
        }
    });
    
    console.log('Scheduled Jobs Initialized');
};
