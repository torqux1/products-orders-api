const OrdersController = require('../controllers/OrdersController');
const OrdersValidationSchema = require('../validationSchemas/OrdersValidationSchema');
const auth = require('../../authorization/controllers/AuthorizationController').auth;
const schemaValidator = require('../../common/middlewares/schema-validator');


exports.routesConfig = function (app) {

    const ordersController = new OrdersController();

    app.get('/orders', [
        auth,
        schemaValidator(OrdersValidationSchema.index),
        ordersController.list.bind(ordersController)
    ]);

    app.get('/orders/:orderId', [
        auth,
        schemaValidator(OrdersValidationSchema.show),
        ordersController.getById.bind(ordersController)
    ]);

    app.post('/orders', [
        auth,
        schemaValidator(OrdersValidationSchema.store),
        ordersController.insert.bind(ordersController)
    ]);

    app.patch('/orders/:orderId', [
        auth,
        schemaValidator(OrdersValidationSchema.update),
        ordersController.updateById.bind(ordersController)
    ]);
};
