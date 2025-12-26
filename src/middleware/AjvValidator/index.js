
const Ajv = require("ajv");
const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
require("ajv-errors")(ajv);

// Function to validate body request
function validateBody(schema) {
    const validate = ajv.compile(schema);

    return (req, res, next) => {
        const valid = validate(req.body);

        if(!valid) {
            const errors = validate.errors.map(error => error.message)
            const errorMessage = errors.join('. ')
            return res.status(400).send({ message: errorMessage });
        }

        next();
    }
}

// Function to validate params request
function validateParams(schema) {
    const validate = ajv.compile(schema);

    return function (req, res, next) {
        const valid = validate(req.params);

        if (!valid) {
            const errors = validate.errors.map(error => error.message);
            const errorMessage = errors.join('. ');
            return res.status(400).send({
                message: errorMessage,
            });
        }

        next();
    };
}

// Function to validate query request
function validateQuery(schema) {
    const validate = ajv.compile(schema);

    return function (req, res, next) {
        const valid = validate(req.query);

        if (!valid) {
            const errors = validate.errors.map(error => error.message);
            const errorMessage = errors.join('. ');
            return res.status(400).send({
                message: errorMessage,
            });
        }

        next();
    };
}

module.exports = { validateBody, validateParams, validateQuery };
