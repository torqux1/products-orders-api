const OrderModel = require('../models/Order');
const errors = require('../../common/config/errors');
const config = require('../config/default-config');

class OrdersController {
    constructor() {

    }

    insert(req, res, next) {
        const nowdate = new Date();
        const formattedDate = nowdate.getFullYear() + "-" + (nowdate.getMonth() + 1) + "-" + nowdate.getDate();
        
        req.body.date = formattedDate;
        OrderModel.createOrder(req.body)
            .then((result) => {
                res.status(errors.SUCC_CREATED.code).send({
                    id: result._id
                });
            })
            .catch((err) => next(err));
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
        OrderModel.list(limit, page)
            .then((result) => {
                res.status(errors.SUCC_OPERATION.code).send(result);
            })
            .catch(err => next(err));
    };

    getById(req, res, next) {
        OrderModel.findById(req.params.orderId)
            .then((result) => {
                if(!result[0]) {
                    return res.status(errors.NO_SUCH_RESOURCE.code).send({message: errors.NO_SUCH_RESOURCE.description});
                }
                res.status(errors.SUCC_OPERATION.code).send(result);
            })
            .catch(err => next(err));
    };

    getByProductId(req, res, next) {
        return OrderModel.findByProductId(req.params.productId)
            .catch(err => {
                if(err && err.code === errors.CONFLICT_REQUEST.code){
                    return Promise.reject(err);
                }
                next(err);
            });
    };

    updateById(req, res, next) {
        OrderModel.updateOrder(req.params.orderId, req.body)
            .then((result) => {
                if(!result){
                    return res.status(errors.SUCC_OPERATION.code).send({updated: 0});
                }
                res.status(errors.SUCC_OPERATION.code).send(result);
            })
            .catch(err => next(err));
    };

    removeById(req, res, next) {
        OrderModel.removeById(req.params.orderId)
            .then((result) => {
                res.status(errors.SUCC_OPERATION.code).send({
                    deleted: result.deletedCount
                });
            })
            .catch(err => next(err));
    };
}

module.exports = OrdersController;