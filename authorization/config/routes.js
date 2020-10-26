const AuthorizationController = require('../controllers/AuthorizationController');
const AuthValidationSchema = require('../validationSchemas/AuthValidationSchema');
const userVerification = require('../middlewares/user-verification');
const schemaValidator = require('../../common/middlewares/schema-validator');


exports.routesConfig = function (app) {
    app.post('/login', [
        schemaValidator(AuthValidationSchema.login),
        userVerification.isPasswordAndUserMatch,
        AuthorizationController.login
    ]);

    app.post('/register', [
        schemaValidator(AuthValidationSchema.register),
        AuthorizationController.register
    ]);
};