const budgetService = require('./budgets.service');

exports.createBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await budgetService.createBudget(req.body, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getBudgets = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await budgetService.getBudgets(userId, req.query);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getBudgetById = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await budgetService.getBudgetById(req.params.id, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await budgetService.updateBudget(req.params.id, userId, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await budgetService.deleteBudget(req.params.id, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.copyBudget = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await budgetService.copyBudget(req.body, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
