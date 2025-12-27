'use strict';

const CreditCardModel = require('./models/creditCard.model');
const TransactionModel = require('./models/transaction.model');
const InstallmentModel = require('./models/installment.model');
const UserModel = require('../users/users.model'); // Import User Model
const notificationService = require('../../services/notification.service'); // Import Notification Service

exports.createCard = async (data, userId) => {
    try {
        const { name, alias, limitGTQ, installmentsLimit, cutoffDay, paymentDay, exchangeRate } = data;
        
        const newCard = new CreditCardModel({
            user: userId,
            name,
            alias,
            limitGTQ,
            installmentsLimit: installmentsLimit || (limitGTQ * 2),
            cutoffDay,
            paymentDay,
            exchangeRate: exchangeRate || 8
        });

        await newCard.save();
        return {
            success: true,
            message: 'Credit card created successfully',
            status: 201,
            data: newCard
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error creating credit card',
            status: 500,
            data: error
        };
    }
};

exports.getCards = async (userId) => {
    try {
        const cards = await CreditCardModel.find({ user: userId });
        
        const cardsWithDetails = await Promise.all(cards.map(async (card) => {
            const transactions = await TransactionModel.find({ card: card._id, isPaid: false });
            const installments = await InstallmentModel.find({ card: card._id });

            let normalDebtGTQ = 0;
            let installmentsDebtGTQ = 0;

            // Sum Normal Transactions
            transactions.forEach(t => {
                if (t.currency === 'GTQ') normalDebtGTQ += t.amount;
                else normalDebtGTQ += t.amount * card.exchangeRate;
            });

            // Sum Installments
            installments.forEach(i => {
                const remaining = i.totalAmount - (i.paidInstallments * i.amountPerInstallment);
                if (remaining > 0) {
                     // Current month installment affects normal limit if not paid?
                     // Logic: "SOLO la cuota del mes actual de cada plan activo"
                     // Check if paid this month
                     let isPaidThisMonth = false;
                     if (i.lastPaymentDate) {
                         const now = new Date();
                         const last = new Date(i.lastPaymentDate);
                         if (last.getMonth() === now.getMonth() && last.getFullYear() === now.getFullYear()) {
                             isPaidThisMonth = true;
                         }
                     }
                     
                     if (!isPaidThisMonth) {
                         let monthlyAmountGTQ = 0;
                         if (i.currency === 'GTQ') monthlyAmountGTQ = i.amountPerInstallment;
                         else monthlyAmountGTQ = i.amountPerInstallment * card.exchangeRate;
    
                         normalDebtGTQ += monthlyAmountGTQ;
                     }

                     // Total remaining debt for installments limit check
                     if (i.currency === 'GTQ') installmentsDebtGTQ += remaining;
                     else installmentsDebtGTQ += remaining * card.exchangeRate;
                }
            });

            const cardObj = card.toObject({ virtuals: true });
            cardObj.totalDebtGTQ = normalDebtGTQ; // For UI display of "Consumed"
            cardObj.availableGTQ = card.limitGTQ - normalDebtGTQ;
            cardObj.availableUSD = (card.limitGTQ - normalDebtGTQ) / card.exchangeRate;
            
            // Add installments info
            cardObj.installmentsLimit = card.installmentsLimit || (card.limitGTQ * 2);
            cardObj.installmentsDebtGTQ = installmentsDebtGTQ;
            cardObj.availableInstallmentsGTQ = cardObj.installmentsLimit - installmentsDebtGTQ;

            return cardObj;
        }));

        return {
            success: true,
            message: 'Credit cards retrieved successfully',
            status: 200,
            data: cardsWithDetails
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error fetching credit cards',
            status: 500,
            data: error
        };
    }
};

exports.getCardById = async (id, userId) => {
    try {
        const card = await CreditCardModel.findOne({ _id: id, user: userId });
        if (!card) return {
            success: false,
            message: 'Credit card not found',
            status: 404,
            data: null
        };
        
        // Get details
        const transactions = await TransactionModel.find({ card: id }).sort({ date: -1 });
        const installments = await InstallmentModel.find({ card: id });

        // Calculate Availability same as getCards
        const unpaidTransactions = transactions.filter(t => !t.isPaid);
        let normalDebtGTQ = 0;
        let installmentsDebtGTQ = 0;

        unpaidTransactions.forEach(t => {
            if (t.currency === 'GTQ') normalDebtGTQ += t.amount;
            else normalDebtGTQ += t.amount * card.exchangeRate;
        });

        installments.forEach(i => {
            const remaining = i.totalAmount - (i.paidInstallments * i.amountPerInstallment);
            if (remaining > 0) {
                 // Check if paid this month
                 let isPaidThisMonth = false;
                 if (i.lastPaymentDate) {
                     const now = new Date();
                     const last = new Date(i.lastPaymentDate);
                     if (last.getMonth() === now.getMonth() && last.getFullYear() === now.getFullYear()) {
                         isPaidThisMonth = true;
                     }
                 }
                 
                 if (!isPaidThisMonth) {
                     let monthlyAmountGTQ = 0;
                     if (i.currency === 'GTQ') monthlyAmountGTQ = i.amountPerInstallment;
                     else monthlyAmountGTQ = i.amountPerInstallment * card.exchangeRate;

                     normalDebtGTQ += monthlyAmountGTQ;
                 }

                 if (i.currency === 'GTQ') installmentsDebtGTQ += remaining;
                 else installmentsDebtGTQ += remaining * card.exchangeRate;
            }
        });

        const cardObj = card.toObject({ virtuals: true });
        cardObj.totalDebtGTQ = normalDebtGTQ;
        cardObj.availableGTQ = card.limitGTQ - normalDebtGTQ;
        cardObj.installmentsLimit = card.installmentsLimit || (card.limitGTQ * 2);
        cardObj.installmentsDebtGTQ = installmentsDebtGTQ;
        cardObj.availableInstallmentsGTQ = cardObj.installmentsLimit - installmentsDebtGTQ;

        return {
            success: true,
            message: 'Credit card found',
            status: 200,
            data: {
                card: cardObj,
                transactions,
                installments
            }
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error fetching credit card',
            status: 500,
            data: error
        };
    }
};

exports.updateCard = async (id, userId, data) => {
    try {
        const card = await CreditCardModel.findOneAndUpdate(
            { _id: id, user: userId },
            data,
            { new: true }
        );
        if (!card) return {
            success: false,
            message: 'Credit card not found',
            status: 404,
            data: null
        };
        return {
            success: true,
            message: 'Credit card updated',
            status: 200,
            data: card
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error updating credit card',
            status: 500,
            data: error
        };
    }
};

exports.deleteCard = async (id, userId) => {
    try {
        const card = await CreditCardModel.findOneAndDelete({ _id: id, user: userId });
        if (!card) return {
            success: false,
            message: 'Credit card not found',
            status: 404,
            data: null
        };
        
        // Clean up related data
        await TransactionModel.deleteMany({ card: id });
        await InstallmentModel.deleteMany({ card: id });

        return {
            success: true,
            message: 'Credit card deleted',
            status: 200,
            data: null
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error deleting credit card',
            status: 500,
            data: error
        };
    }
};

// Helper to calculate debt
async function calculateTotalDebtGTQ(cardId, exchangeRate) {
    const transactions = await TransactionModel.find({ card: cardId, isPaid: false });
    const installments = await InstallmentModel.find({ card: cardId });
    
    let total = 0;
    
    transactions.forEach(t => {
        if (t.currency === 'GTQ') total += t.amount;
        else total += t.amount * exchangeRate;
    });

    installments.forEach(i => {
        const remaining = i.totalAmount - (i.paidInstallments * i.amountPerInstallment);
        if (remaining > 0) {
            if (i.currency === 'GTQ') total += remaining;
            else total += remaining * exchangeRate;
        }
    });
    
    return total;
}

// Helper for Notifications
async function checkLimitAndNotify(cardId, userId, cardName, limitGTQ, exchangeRate) {
    try {
        const totalDebt = await calculateTotalDebtGTQ(cardId, exchangeRate);
        const usageRatio = totalDebt / limitGTQ;
        const user = await UserModel.findById(userId);

        if (user && user.fcmToken) {
            if (usageRatio >= 0.9) {
                // 90% Alert
                const remaining = limitGTQ - totalDebt;
                await notificationService.sendNotificationToUser(
                    user,
                    '¡Alerta Crítica de Límite!',
                    `Estás al ${(usageRatio * 100).toFixed(1)}% de tu límite en "${cardName}". Disponible: Q${remaining.toFixed(2)}`,
                    { type: 'limit_warning', cardId: cardId.toString() }
                );
            } else if (usageRatio >= 0.5) {
                // 50% Alert
                await notificationService.sendNotificationToUser(
                    user,
                    'Consumo de Tarjeta',
                    `Ya has consumido el 50% de tu límite en "${cardName}".`,
                    { type: 'limit_info', cardId: cardId.toString() }
                );
            }
        }
    } catch (error) {
        console.error('Error sending limit notification:', error);
    }
}

// Transaction Management
exports.addTransaction = async (cardId, userId, transactionData) => {
    try {
        const card = await CreditCardModel.findOne({ _id: cardId, user: userId });
        if (!card) return {
            success: false,
            message: 'Credit card not found',
            status: 404,
            data: null
        };

        // CHECK LIMIT STRICT
        const currentDebt = await calculateTotalDebtGTQ(cardId, card.exchangeRate, card.limitGTQ, card.installmentsLimit);
        
        // availableGTQ is effectively what we calculated inside the helper or similar.
        // Let's reuse logic or create a proper checker.
        // Re-calculate normal availability here for strict check
        // We need 'normal' availability.
        // Quick logic:
        const allTrans = await TransactionModel.find({ card: cardId, isPaid: false });
        const allInst = await InstallmentModel.find({ card: cardId });
        
        let usedNormal = 0;
        allTrans.forEach(t => {
             if (t.currency === 'GTQ') usedNormal += t.amount;
             else usedNormal += t.amount * card.exchangeRate;
        });
        
        allInst.forEach(i => {
             const remaining = i.totalAmount - (i.paidInstallments * i.amountPerInstallment);
             if (remaining > 0) {
                 // Check if paid this month
                 let isPaidThisMonth = false;
                 if (i.lastPaymentDate) {
                     const now = new Date();
                     const last = new Date(i.lastPaymentDate);
                     if (last.getMonth() === now.getMonth() && last.getFullYear() === now.getFullYear()) {
                         isPaidThisMonth = true;
                     }
                 }

                 if (!isPaidThisMonth) {
                     if (i.currency === 'GTQ') usedNormal += i.amountPerInstallment;
                     else usedNormal += i.amountPerInstallment * card.exchangeRate;
                 }
             }
        });

        const available = card.limitGTQ - usedNormal;
        
        let newTxAmountGTQ = 0;
        if (transactionData.currency === 'GTQ') newTxAmountGTQ = transactionData.amount;
        else newTxAmountGTQ = transactionData.amount * card.exchangeRate;

        if (newTxAmountGTQ > available) {
             return {
                success: false,
                message: 'Fondos insuficientes (Límite Normal Excedido)',
                status: 400,
                data: null
            };
        }

        const transaction = new TransactionModel({
            ...transactionData,
            card: cardId,
            user: userId
        });

        await transaction.save();

        // CHECK LIMIT WARNING (Now includes 50% check)
        await checkLimitAndNotify(cardId, userId, card.name, card.limitGTQ, card.exchangeRate);

        return {
            success: true,
            message: 'Transaction added',
            status: 201,
            data: transaction
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error adding transaction',
            status: 500,
            data: error
        };
    }
};

exports.payTransaction = async (transactionId, userId) => {
    try {
        const transaction = await TransactionModel.findOne({ _id: transactionId, user: userId });
        if (!transaction) return {
            success: false,
            message: 'Transaction not found',
            status: 404,
            data: null
        };

        transaction.isPaid = true;
        await transaction.save();

        return {
            success: true,
            message: 'Transaction marked as paid',
            status: 200,
            data: transaction
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error paying transaction',
            status: 500,
            data: error
        };
    }
};

exports.deleteTransaction = async (transactionId, userId) => {
    try {
        const transaction = await TransactionModel.findOneAndDelete({ _id: transactionId, user: userId });
        if (!transaction) return {
            success: false,
            message: 'Transaction not found',
            status: 404,
            data: null
        };

        return {
            success: true,
            message: 'Transaction deleted',
            status: 200,
            data: null
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error deleting transaction',
            status: 500,
            data: error
        };
    }
};

// Installment Management
exports.addInstallment = async (cardId, userId, installmentData) => {
    try {
        const card = await CreditCardModel.findOne({ _id: cardId, user: userId });
        if (!card) return {
            success: false,
            message: 'Credit card not found',
            status: 404,
            data: null
        };

        // CHECK INSTALLMENTS LIMIT
        const installmentsLimit = card.installmentsLimit || (card.limitGTQ * 2);
        
        // Calculate current installments debt
        const allInst = await InstallmentModel.find({ card: cardId });
        let usedInstallments = 0;
        allInst.forEach(i => {
             const remaining = i.totalAmount - (i.paidInstallments * i.amountPerInstallment);
             if (remaining > 0) {
                 if (i.currency === 'GTQ') usedInstallments += remaining;
                 else usedInstallments += remaining * card.exchangeRate;
             }
        });

        let newInstAmountGTQ = 0;
        if (installmentData.currency === 'GTQ') newInstAmountGTQ = installmentData.totalAmount;
        else newInstAmountGTQ = installmentData.totalAmount * card.exchangeRate;
        
        if ((usedInstallments + newInstAmountGTQ) > installmentsLimit) {
             return {
                success: false,
                message: 'Límite de Cuotas (Extra-financiamiento) Excedido',
                status: 400,
                data: null
            };
        }

        const installment = new InstallmentModel({
            ...installmentData,
            card: cardId,
            user: userId
        });

        await installment.save();

        // Also check limit when adding installment
        await checkLimitAndNotify(cardId, userId, card.name, card.limitGTQ, card.exchangeRate);

        return {
            success: true,
            message: 'Installment added',
            status: 201,
            data: installment
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error adding installment',
            status: 500,
            data: error
        };
    }
};

exports.payInstallment = async (installmentId, userId) => {
    try {
        const installment = await InstallmentModel.findOne({ _id: installmentId, user: userId });
        if (!installment) return {
            success: false,
            message: 'Installment not found',
            status: 404,
            data: null
        };

        if (installment.paidInstallments < installment.totalInstallments) {
            installment.paidInstallments += 1;
            installment.lastPaymentDate = new Date();
            
            // Add to payments history
            installment.payments.push({
                number: installment.paidInstallments,
                date: new Date(),
                amount: installment.amountPerInstallment
            });

            await installment.save();
            return {
                success: true,
                message: 'Installment payment recorded',
                status: 200,
                data: installment
            };
        } else {
            return {
                success: false,
                message: 'Installment already fully paid',
                status: 400,
                data: null
            };
        }
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error paying installment',
            status: 500,
            data: error
        };
    }
};

exports.deleteInstallment = async (installmentId, userId) => {
    try {
        const installment = await InstallmentModel.findOneAndDelete({ _id: installmentId, user: userId });
        if (!installment) return {
            success: false,
            message: 'Installment not found',
            status: 404,
            data: null
        };

        return {
            success: true,
            message: 'Installment deleted',
            status: 200,
            data: null
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error deleting installment',
            status: 500,
            data: error
        };
    }
};
