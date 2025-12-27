'use strict';

const BudgetModel = require('./budgets.model');

exports.createBudget = async (data, userId) => {
    try {
        const { month, year, type, sections, currency } = data;

        // Check if budget already exists for this month/year
        const existingBudget = await BudgetModel.findOne({ user: userId, month, year });
        if (existingBudget) return {
            success: false,
            message: 'Budget already exists for this month',
            status: 400,
            data: null
        };

        const budget = new BudgetModel({
            user: userId,
            month,
            year,
            type,
            sections,
            currency: currency || 'GTQ'
        });

        await budget.save();
        return {
            success: true,
            message: 'Budget created successfully',
            status: 201,
            data: budget
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error creating budget',
            status: 500,
            data: error
        };
    }
};

exports.getBudgets = async (userId, queryParams) => {
    try {
        const { year } = queryParams;
        const query = { user: userId };
        if (year) query.year = year;

        const budgets = await BudgetModel.find(query).sort({ year: -1, month: -1 });
        return {
            success: true,
            message: 'Budgets retrieved successfully',
            status: 200,
            data: budgets
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error fetching budgets',
            status: 500,
            data: error
        };
    }
};

exports.getBudgetById = async (id, userId) => {
    try {
        const budget = await BudgetModel.findOne({ _id: id, user: userId });
        
        if (!budget) return {
            success: false,
            message: 'Budget not found',
            status: 404,
            data: null
        };

        return {
            success: true,
            message: 'Budget retrieved successfully',
            status: 200,
            data: budget
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error fetching budget',
            status: 500,
            data: error
        };
    }
};

exports.updateBudget = async (id, userId, updateData) => {
    try {
        const budget = await BudgetModel.findOneAndUpdate(
            { _id: id, user: userId },
            updateData,
            { new: true }
        );

        if (!budget) return {
            success: false,
            message: 'Budget not found',
            status: 404,
            data: null
        };

        return {
            success: true,
            message: 'Budget updated successfully',
            status: 200,
            data: budget
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error updating budget',
            status: 500,
            data: error
        };
    }
};

exports.deleteBudget = async (id, userId) => {
    try {
        const budget = await BudgetModel.findOneAndDelete({ _id: id, user: userId });

        if (!budget) return {
            success: false,
            message: 'Budget not found',
            status: 404,
            data: null
        };

        return {
            success: true,
            message: 'Budget deleted successfully',
            status: 200,
            data: null
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error deleting budget',
            status: 500,
            data: error
        };
    }
};

exports.copyBudget = async (data, userId) => {
    try {
        const { sourceBudgetId, targetMonth, targetYear } = data;

        const sourceBudget = await BudgetModel.findOne({ _id: sourceBudgetId, user: userId });
        if (!sourceBudget) return {
            success: false,
            message: 'Source budget not found',
            status: 404,
            data: null
        };

        const existingTarget = await BudgetModel.findOne({ user: userId, month: targetMonth, year: targetYear });
        if (existingTarget) return {
            success: false,
            message: 'Target budget already exists',
            status: 400,
            data: null
        };

        const newSections = sourceBudget.sections.map(section => ({
            title: section.title,
            income: section.income,
            expenses: section.expenses.map(exp => ({
                name: exp.name,
                amount: exp.amount,
                category: exp.category,
                isPaid: false 
            })),
            savings: section.savings || 0
        }));

        const newBudget = new BudgetModel({
            user: userId,
            month: targetMonth,
            year: targetYear,
            type: sourceBudget.type,
            sections: newSections,
            currency: sourceBudget.currency
        });

        await newBudget.save();
        return {
            success: true,
            message: 'Budget copied successfully',
            status: 201,
            data: newBudget
        };

    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Error copying budget',
            status: 500,
            data: error
        };
    }
};
