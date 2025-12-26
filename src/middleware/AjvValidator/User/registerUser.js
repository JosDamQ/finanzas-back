const Ajv = require('ajv');
const ajv = new Ajv({allErrors: true, allowUnionTypes: true});
require('ajv-errors')(ajv);

const schemaRegisterUser = {
    type: 'object',
    properties: {
        name: {
            type: 'string',
            minLength: 3,
            maxLength: 20,
            errorMessage: {
                type: 'Name must be a string',
                minLength: 'Name must be at least 3 characters long',
                maxLength: 'Name must be at most 20 characters long'
            }
        },
        birthdate: {
            type: 'string',
            pattern: '\\d{4}-\\d{2}-\\d{2}',
            errorMessage: {
                type: 'Birthdate must be a string in the format YYYY-MM-DD',
                pattern: 'Birthdate must be a valid date in the format YYYY-MM-DD'
            }
        },
        phone: {
            type: 'number',
            pattern: '^[0-9]+$',
            errorMessage: {
                type: 'Phone must be a number',
                pattern: 'Phone must only contain digits'
            }
        },
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
        image: {
            type: 'string',
            default: 'src/assets/default-user.jpg',
            errorMessage: {
                type: 'Image must be a string',
            }
        }
    },
    required: ['name', 'birthdate', 'phone', 'email', 'password'],
    errorMessage: {
        required: {
            name: 'Name is required',
            birthdate: 'Birthdate is required',
            phone: 'Phone is required',
            email: 'Email is required',
            password: 'Password is required'
        }
    },
    additionalProperties: false,
}

module.exports = schemaRegisterUser;
