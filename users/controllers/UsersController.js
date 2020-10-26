const UserModel = require('../models/User');
const crypto = require('crypto');
const errors = require('../../common/config/errors');
const config = require('../config/default-config');
const customErrMsgs =  require('../config/custom-error-messages');

class UsersController {
    constructor() {
        
    }

    insert(req, res, next) {
        return UserModel.findByUsername(req.body.username).then((user) => {
            if (user[0]) {
                const err = errors.CONFLICT_REQUEST.setCustomMessage(customErrMsgs.USER_ALREADY_EXISTS);
                return Promise.reject(err);    
            }
            let salt = crypto.randomBytes(16).toString('base64')
            let hash = crypto
                .createHmac('sha512', salt)
                .update(req.body.password)
                .digest('base64')
            req.body.password = salt + '$' + hash
        
            return UserModel.createUser(req.body);
        })
        .catch(err => {
            if(err && err.code === errors.CONFLICT_REQUEST.code){
                return Promise.reject(err);
            }
            next(err);
        });
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
        UserModel.list(limit, page)
            .then((result) => {
                res.status(errors.SUCC_CREATED.code).send(result);
            })
            .catch(err => next(err));
    };

    getById(req, res, next) {
        UserModel.findById(req.params.userId)
            .then((result) => {
                res.status(errors.SUCC_CREATED.code).send(result);
            })
            .catch(err => next(err));;
    };

    patchById(req, res, next) {
        if (req.body.password) {
            let salt = crypto.randomBytes(16).toString('base64');
            let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
            req.body.password = salt + "$" + hash;
        }

        UserModel.patchUser(req.params.userId, req.body)
            .then((result) => {
                res.status(errors.SUCC_OPERATION.code).send(result);
            })
            .catch(err => next(err));;

    };

    removeById(req, res, next) {
        UserModel.removeById(req.params.userId)
            .then((result) => {
                res.status(errors.SUCC_OPERATION.code).send({
                    deleted: result.deletedCount
                });
            })
            .catch(err => next(err));;
    };
};

module.exports = UsersController;