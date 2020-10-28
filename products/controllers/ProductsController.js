const ProductModel = require('../models/Product');
const errors = require('../../common/config/errors');
const config = require('../config/default-config');
const customErrMsgs =  require('../config/custom-error-messages');
const OrderController = require('../../orders/controllers/OrdersController');

class ProductsController {
    constructor(localCache) {
      this.vatService = require('../services/vat-applier')(localCache);
    }
  
    insert(req, res, next) {
        ProductModel.createProduct(req.body)
            .then((result) => {
                res.status(errors.SUCC_CREATED.code).send({
                    id: result._id
                });
            })
            .catch(err => next(err));
    };

    list(req, res, next) {
        let limit = req.query.limit && req.query.limit <= config.SELECT_MAX_LIMIT ? parseInt(req.query.limit) : config.SELECT_LIMIT;
        let page = 0;

        if (req.query) {
            if (req.query.page) {
                req.query.page = parseInt(req.query.page);
                page = Number.isInteger(req.query.page) ? req.query.page : 0;
            }
        }
        ProductModel.list(limit, page)
            .then(result => {
                const countryCode = (req.user && req.user.countryCode) || config.COUNTRY_CODE;

                return this.vatService.applyVAT(result, countryCode);
            })
            .then(applied =>  res.status(errors.SUCC_OPERATION.code).send(applied))
            .catch(err => next(err));
    };

    getById(req, res, next) {
        ProductModel.findById(req.params.productId)
            .then(result => {
                if(!result[0]) {
                    return res.status(errors.NO_SUCH_RESOURCE.code).send({message: errors.NO_SUCH_RESOURCE.description});
                }
                const countryCode = (req.user && req.user.countryCode) || config.COUNTRY_CODE;

                return this.vatService.applyVAT(result, countryCode);
            })
            .then(applied =>  res.status(errors.SUCC_OPERATION.code).send(applied[0]))
            .catch(err => next(err));
    };

    updateById(req, res, next) {
        ProductModel.updateProduct(req.params.productId, req.body)
            .then((result) => {
                if(!result){
                    return res.status(errors.SUCC_OPERATION.code).send({updated: 0});
                }
                res.status(errors.SUCC_OPERATION.code).send(result);
            })
            .catch(err => next(err));
    };

    removeById(req, res, next) {
        const orderController = new OrderController();

        orderController.getByProductId(req, res)
            .then((orders) => {
                if (orders.length !== 0) {
                    return res.status(errors.CONFLICT_REQUEST.code).send({message: customErrMsgs.PRODUCT_EXISTS_IN_ORDER});
                }
                ProductModel.removeById(req.params.productId)
                    .then((result) => {
                        res.status(errors.SUCC_OPERATION.code).send({
                            deleted: result.deletedCount
                        });
                    })
                    .catch(err => next(err));
            });
    };
};

module.exports = ProductsController;