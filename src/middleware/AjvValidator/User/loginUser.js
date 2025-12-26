const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const schemaLoginUser = {
    type: 'object',
    properties: {
        email: {
            type: 'string',
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
            errorMessage: {
                type: 'Email must be a string',
                pattern: 'Email must be a valid email address'
            }
        },
        password: {
            type: 'string',
            minLength: 8,
            maxLength: 20,
            errorMessage: {
                type: 'Password must be a string',
                minLength: 'Password must be at least 8 characters long',
                maxLength: 'Password must be at most 20 characters long'
            }
        },
    },
    required: ['email', 'password'],
    errorMessage: {
        required: {
            email: 'Email is required',
            password: 'Password is required'
        }
    },
    additionalProperties: false
}

module.exports = schemaLoginUser;