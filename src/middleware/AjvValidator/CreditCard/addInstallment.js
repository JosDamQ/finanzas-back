const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const schemaAddInstallment = {
    type: 'object',
    properties: {
        description: {
            type: 'string',
            minLength: 1,
            errorMessage: {
                type: 'Description must be a string',
                minLength: 'Description is required'
            }
        },
        totalAmount: {
            type: 'number',
            minimum: 0,
            errorMessage: {
                type: 'Total Amount must be a number',
                minimum: 'Total Amount must be non-negative'
            }
        },
        currency: {
            type: 'string',
            enum: ['GTQ', 'USD'],
            errorMessage: {
                enum: 'Currency must be GTQ or USD'
            }
        },
        totalInstallments: {
            type: 'number',
            minimum: 1,
            errorMessage: {
                type: 'Total Installments must be a number',
                minimum: 'Total Installments must be at least 1'
            }
        },
        paidInstallments: {
            type: 'number',
            minimum: 0
        },
        amountPerInstallment: {
            type: 'number',
            minimum: 0,
            errorMessage: {
                type: 'Amount per installment must be a number'
            }
        },
        startDate: {
            type: 'string',
             pattern: '^\\d{4}-\\d{2}-\\d{2}(T\\d{2}:\\d{2}:\\d{2}(\\.\\d{3})?Z?)?$',
            errorMessage: {
                pattern: 'Start Date must be a valid ISO string'
            }
        }
    },
    required: ['description', 'totalAmount', 'currency', 'totalInstallments', 'amountPerInstallment'],
    errorMessage: {
        required: {
            description: 'Description is required',
            totalAmount: 'Total Amount is required',
            currency: 'Currency is required',
            totalInstallments: 'Total Installments is required',
            amountPerInstallment: 'Amount per installment is required'
        }
    },
    additionalProperties: false
};

module.exports = schemaAddInstallment;
