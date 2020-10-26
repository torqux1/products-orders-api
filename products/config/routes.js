const ProductsController = require('../controllers/ProductsController');
const ProductsValidationSchema = require('../validationSchemas/ProductsValidationSchema');
const auth = require('../../authorization/controllers/AuthorizationController').auth;
const schemaValidator = require('../../common/middlewares/schema-validator');


exports.routesConfig = function (app) {

    const productsController = new ProductsController(app.get('localCache'));

    app.get('/products', [
        auth,
        schemaValidator(ProductsValidationSchema.index),
        productsController.list.bind(productsController)
    ]);

    app.get('/products/:productId', [
        auth,
        schemaValidator(ProductsValidationSchema.show),
        productsController.getById.bind(productsController)
    ]);

    app.post('/products', [
        auth,
        schemaValidator(ProductsValidationSchema.store),
        productsController.insert.bind(productsController)
    ]);

    app.patch('/products/:productId', [
        auth,
        schemaValidator(ProductsValidationSchema.update),
        productsController.updateById.bind(productsController)
    ]);
    
    app.delete('/products/:productId', [
        auth,
        schemaValidator(ProductsValidationSchema.destroy),
        productsController.removeById.bind(productsController)
    ]);
};
