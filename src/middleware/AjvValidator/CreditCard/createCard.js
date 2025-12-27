const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const schemaCreateCard = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 1,
            errorMessage: {
                type: 'Name must be a string',
                minLength: 'Name is required'
            }
        },
        alias: {
            type: 'string'
        },
        limitGTQ: {
            type: 'number',
            minimum: 0,
            errorMessage: {
                type: 'Limit GTQ must be a number',
                minimum: 'Limit GTQ must be non-negative'
            }
        },
        installmentsLimit: {
            type: 'number',
            minimum: 0
        },
        exchangeRate: {
            type: 'number',
            minimum: 0
        },
        cutoffDay: {
            type: 'number',
            minimum: 1,
            maximum: 31,
            errorMessage: {
                type: 'Cutoff Day must be a number',
                minimum: 'Cutoff Day must be between 1 and 31',
                maximum: 'Cutoff Day must be between 1 and 31'
            }
        },
        paymentDay: {
            type: 'number',
            minimum: 1,
            maximum: 31,
            errorMessage: {
                type: 'Payment Day must be a number',
                minimum: 'Payment Day must be between 1 and 31',
                maximum: 'Payment Day must be between 1 and 31'
            }
        }
    },
    required: ['name', 'limitGTQ', 'cutoffDay', 'paymentDay'],
    errorMessage: {
        required: {
            name: 'Name is required',
            limitGTQ: 'Limit GTQ is required',
            cutoffDay: 'Cutoff Day is required',
            paymentDay: 'Payment Day is required'
        }
    },
    additionalProperties: false
};

module.exports = schemaCreateCard;
