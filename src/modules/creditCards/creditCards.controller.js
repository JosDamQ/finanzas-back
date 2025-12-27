const creditCardService = require('./creditCards.service');

exports.createCard = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await creditCardService.createCard(req.body, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCards = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await creditCardService.getCards(userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getCardById = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await creditCardService.getCardById(req.params.id, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.updateCard = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await creditCardService.updateCard(req.params.id, userId, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteCard = async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await creditCardService.deleteCard(req.params.id, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await creditCardService.addTransaction(id, userId, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.payTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { transactionId } = req.params;
        const result = await creditCardService.payTransaction(transactionId, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const userId = req.user.id;
        const { transactionId } = req.params;
        const result = await creditCardService.deleteTransaction(transactionId, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.addInstallment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;
        const result = await creditCardService.addInstallment(id, userId, req.body);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.payInstallment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { installmentId } = req.params;
        const result = await creditCardService.payInstallment(installmentId, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

exports.deleteInstallment = async (req, res) => {
    try {
        const userId = req.user.id;
        const { installmentId } = req.params;
        const result = await creditCardService.deleteInstallment(installmentId, userId);
        return res.status(result.status).json(result);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
