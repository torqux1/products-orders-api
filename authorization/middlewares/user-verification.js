const crypto = require('crypto');
const UserModel = require('../../users/models/User');
const errors = require('../../common/config/errors');

exports.isPasswordAndUserMatch = (req, res, next) => {
    UserModel.findByUsername(req.body.username).then((user) => {
        if (!user[0]) {
            return res.status(errors.NOT_AUTHORIZED.code).send({message: errors.NOT_AUTHORIZED.description});
        }
        let passwordFields = user[0].password.split('$')
        let salt = passwordFields[0]
        let hash = crypto
            .createHmac('sha512', salt)
            .update(req.body.password)
            .digest('base64');

        if (hash === passwordFields[1]) {
            req.body.userId = user[0]._id;
            return next();
        }
            
        return res.status(errors.NOT_AUTHORIZED.code).send({message: errors.NOT_AUTHORIZED.description});
    });
};