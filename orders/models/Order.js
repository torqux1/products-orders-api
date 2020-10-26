const mongoose = require('../../common/services/mongoose-starter').mongoose;
const Schema = mongoose.Schema;
const errors = require('../../common/config/errors');
const customErrMsgs =  require('../config/custom-error-messages');

const orderSchema = new Schema({
    date: String,
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'Product'
    }],
    status: {
        type: String,
        enum: ['Pending', 'Processing', 'Delivered', 'Cancelled']
    }
}, {
    versionKey: false
});

orderSchema.pre('save', function (next) {
    const Products = mongoose.model('Products');
    const products = this.products;
    return Products.find().where('_id').in(products).exec((err, records) => {
        if(err) return next(err);

        if (records.length !== products.length)  {
            const err = errors.CONFLICT_REQUEST.setCustomMessage(customErrMsgs.INVALID_PRODUCTS_ENTERED);
            return next(err);  
        }
        next();
    });
});


orderSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

const Order = mongoose.model('Orders', orderSchema);


exports.findById = (orderId) => {
    return Order.find({
        _id: orderId
    });
};

exports.findByProductId = function (products) {
    const productList = (typeof products !== 'array')? products : [products];

    return Order.find({ products : { "$in" : productList } });
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Order.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, orders) {
                if (err) {
                    return reject(err);
                }
                resolve(orders);
            })
    });
};

exports.createOrder = (orderData) => {
    const order = new Order(orderData);
    return order.save();
};

exports.updateOrder = (id, orderData) => {
    return Order.findOneAndUpdate({
        _id: id
    }, orderData, { new: true });
};

exports.removeById = (orderId) => {
    return Order.deleteOne({
        _id: orderId
    });
};