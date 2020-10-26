
exports.login = {
    type: 'object',
    properties: {
        body : {
            type: 'object',
            properties: {
                'username': { type: 'string' },
                'password': { type: 'string' },
                'countryCode': { type: 'string' },
            },
            required: ['username', 'password', 'countryCode' ],
            additionalProperties: false
        }
    },   
    required: ['body']
};

 exports.register = {
    type: 'object',
    properties: {
        body : {
            type: 'object',
            properties: {
                'username': { type: 'string' },
                'password': { type: 'string' }
            },
            required: ['username', 'password'],
            additionalProperties: false
        }
    },  
    required: ['body']
 };