exports.index = {
    type: 'object',
    properties: {
        query: {
            type: 'object',
            properties: {
                page: {type: ["string","integer"], "pattern": "^[0-9]+$"},
                limit: {type: ["string","integer"], "pattern": "^[0-9]+$"}
            },
        }
    }
};

exports.show = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                productId: { type: "string" }
            },
            required: ['productId']
        }
    },
    required: ['params']
};

exports.store = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                name : { type: 'string' },
                category : { type: 'string' },
                price : {type: 'number', "minimum": 0}   
            },
            required: ['name', 'category', 'price'],
            additionalProperties: false
        }
    },
    required: ['body']
};

exports.update = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                productId: { type: "string" }
            },
            required: ['productId']
        },
        body: {
            type: 'object',
            properties: {
                name : { type: 'string' },
                category : { type: 'string' },
                price : {type: 'number', "minimum": 0}
            },
            minProperties: 1,
            additionalProperties: false
        }
    },
    required: ['params', 'body']
};

exports.destroy = {
    type: 'object',
    properties: {
        params: {
            type: 'object',
            properties: {
                productId: { type: "string" }
            },
            required: ['productId']
        }
    },
    required: ['params']
};