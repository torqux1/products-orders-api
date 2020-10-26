const axios = require('axios');
const errors = require('../../common/config/errors');

const VAT_ADDRESS =  require('../config/default-config').VAT_SERVICE_ADDRESS;
const testData = require('./test-data').testData; 


module.exports = function(localCache) {
    
    function _getVatPercent (countryCode) {
        /*return new Promise((resolve, reject) => {
            resolve(testData.rates[countryCode].standard_rate);
        });*/
        const rates = localCache.get( "rates" );
        if (!rates){
            console.log('Calling external API');

            return axios.get(VAT_ADDRESS)
                .then(response => {
                    if(response.status !== errors.SUCC_OPERATION.code) {
                        const err = errors.SERVER_ERROR.setCustomMessage(response.statusText);
                        
                        return Promise.reject(err);
                    }
                    //Cache result for 1 day
                    localCache.set("rates", response.data.rates, 86400);

                    return response.data.rates[countryCode].standard_rate;
                });
            }
        return Promise.resolve(rates[countryCode].standard_rate);
    };
    
    function applyVAT(products, countryCode) {
        return _getVatPercent(countryCode)
            .then(percent => {
                return products.map(prod => {
                    prod.price += prod.price*percent/100;
                    prod.price = Math.floor(prod.price * 100) / 100;
                    
                    return prod;
                });
            });
    };

    return {
        applyVAT: applyVAT
    };
};
