
const UsersController = require('../../users/controllers/UsersController');
const UrlPattern = require('url-pattern');
const authFreePaths = require('../../common/config/auth-free-paths');
const errors = require('../../common/config/errors');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRATION_SECONDS}  = require('../../common/config/env-config');


exports.login = (req, res) => {
    try {
        const token = jwt.sign({
            userId: req.body.userId,
            username: req.body.username,
            countryCode: req.body.countryCode
        }, JWT_SECRET, { expiresIn: JWT_EXPIRATION_SECONDS });

        res.status(errors.SUCC_OPERATION.code).send({
            userId: req.body.userId,
            username: req.body.username,
            accessToken: token
        });
    } catch (err) {
        res.status(errors.SERVER_ERROR.code).send({ errors: err });
    }
};

exports.register = (req, res) => {
    const usersController = new UsersController();
    usersController.insert(req, res)
        .then((results) => {
            if (results) {
                res.status(errors.SUCC_OPERATION.code).send({
                    userId: results._id,
                    username: results.username,
                });
            }
        })
        .catch((err) => {
            if(err.code === errors.CONFLICT_REQUEST.code){
                return res.status(err.code).send({message: err.description}); 
            }

            res.json({
                succes: false,
            })
        });
};

exports.auth = (req, res, next) => {
    const authHeader = req.get('Authorization');

    if (!authHeader) {
        const isRouteAuthFree = authFreePaths.some(function (routeConfig) {
            if (req.method !== routeConfig.METHOD) return false;

            const routePattern = new UrlPattern(routeConfig.PATH_PATTERN);
            return routePattern.match(req.path);
        });

        if (isRouteAuthFree) return next();

        return res.status(errors.NOT_AUTHORIZED.code).send({message: errors.NOT_AUTHORIZED.description});
    }

    try {
        const decoded = jwt.verify(authHeader, JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            username: decoded.username,
            countryCode: decoded.countryCode
        }
        next();
    } catch (error) {
        return res.status(errors.NOT_AUTHORIZED.code).send({message: errors.NOT_AUTHORIZED.description});
    }
};