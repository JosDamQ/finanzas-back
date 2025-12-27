const express = require('express');
const router = express.Router();
const budgetController = require('./budgets.controller');
const { verifyToken } = require('../../middleware/loggedIn');
const { validateBody } = require('../../middleware/AjvValidator/index');
const schemaCreateBudget = require('../../middleware/AjvValidator/Budget/createBudget');
const schemaCopyBudget = require('../../middleware/AjvValidator/Budget/copyBudget');

router.post('/', verifyToken, validateBody(schemaCreateBudget), budgetController.createBudget);
router.get('/', verifyToken, budgetController.getBudgets);
router.get('/:id', verifyToken, budgetController.getBudgetById);
router.put('/:id', verifyToken, validateBody(schemaCreateBudget), budgetController.updateBudget);
router.delete('/:id', verifyToken, budgetController.deleteBudget);
router.post('/copy', verifyToken, validateBody(schemaCopyBudget), budgetController.copyBudget);

module.exports = router;
