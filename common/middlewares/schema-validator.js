const Ajv = require('ajv');
const errors = require('../config/errors');

module.exports = function(schema){
    const schemaValidator = function (req, res, next) {
        const ajv = new Ajv();
        const valid = ajv.validate(schema, req);

        if (!valid) {
            return res.status(errors.BAD_REQUEST.code).json(ajv.errors);
        }
        next();
    }

    return schemaValidator;
}

