const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const schemaCopyBudget = {
    type: 'object',
    properties: {
        sourceBudgetId: {
            type: 'string',
            minLength: 24,
            maxLength: 24,
            errorMessage: {
                type: 'Source Budget ID must be a string',
                minLength: 'Invalid ID format',
                maxLength: 'Invalid ID format'
            }
        },
        targetMonth: {
            type: 'number',
            minimum: 1,
            maximum: 12,
            errorMessage: {
                type: 'Target Month must be a number',
                minimum: 'Target Month must be between 1 and 12',
                maximum: 'Target Month must be between 1 and 12'
            }
        },
        targetYear: {
            type: 'number',
            minimum: 2000,
            errorMessage: {
                type: 'Target Year must be a number',
                minimum: 'Target Year must be at least 2000'
            }
        }
    },
    required: ['sourceBudgetId', 'targetMonth', 'targetYear'],
    errorMessage: {
        required: {
            sourceBudgetId: 'Source Budget ID is required',
            targetMonth: 'Target Month is required',
            targetYear: 'Target Year is required'
        }
    },
    additionalProperties: false
};

module.exports = schemaCopyBudget;
