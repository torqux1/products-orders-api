const mongoose = require('../../common/services/mongoose-starter').mongoose;
const Schema = mongoose.Schema;


const productSchema = new Schema({
    name: String,
    category: String,
    price: Number
}, {
    versionKey: false
});

productSchema.virtual('id').get(function () {
    return this._id.toHexString();
});


const Product = mongoose.model('Products', productSchema);


exports.findById = (productId) => {
    return Product.find({
        _id: productId
    });
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Product.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, products) {
                if (err) {
                    return reject(err);
                }
                resolve(products);
            })
    });
};

exports.createProduct = (productData) => {
    productData.price = Math.floor(productData.price * 100) / 100; 
    
    const product = new Product(productData);
    return product.save();
};

exports.updateProduct = (id, productData) => {
    return Product.findOneAndUpdate({
        _id: id
    }, productData, { new: true });
};

exports.removeById = (productId) => {
    return Product.deleteOne({
        _id: productId
    });
};