const express = require('express');
const router = express.Router();
const creditCardController = require('./creditCards.controller');
const { verifyToken } = require('../../middleware/loggedIn');
const { validateBody } = require('../../middleware/AjvValidator/index');
const schemaCreateCard = require('../../middleware/AjvValidator/CreditCard/createCard');
const schemaAddTransaction = require('../../middleware/AjvValidator/CreditCard/addTransaction');
const schemaAddInstallment = require('../../middleware/AjvValidator/CreditCard/addInstallment');

router.post('/', verifyToken, validateBody(schemaCreateCard), creditCardController.createCard);
router.get('/', verifyToken, creditCardController.getCards);
router.get('/:id', verifyToken, creditCardController.getCardById);
router.put('/:id', verifyToken, validateBody(schemaCreateCard), creditCardController.updateCard);
router.delete('/:id', verifyToken, creditCardController.deleteCard);

// Transactions
router.post('/:id/transactions', verifyToken, validateBody(schemaAddTransaction), creditCardController.addTransaction);
router.post('/transactions/:transactionId/pay', verifyToken, creditCardController.payTransaction);
router.delete('/transactions/:transactionId', verifyToken, creditCardController.deleteTransaction);

// Installments
router.post('/:id/installments', verifyToken, validateBody(schemaAddInstallment), creditCardController.addInstallment);
router.post('/installments/:installmentId/pay', verifyToken, creditCardController.payInstallment); // Mark one as paid
router.delete('/installments/:installmentId', verifyToken, creditCardController.deleteInstallment);

module.exports = router;
