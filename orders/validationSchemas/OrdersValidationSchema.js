const statusesPattern = '^(Pending|Processing|Delivered|Cancelled)$';

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
                orderId: { type: "string" }
            },
            required: ['orderId']
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
                status : { type: 'string', pattern: statusesPattern },
                products : { type: 'array' }
            },
            required: ['products', 'status'],
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
                orderId: { type: "string" }
            },
            required: ['orderId']
        },
        body: {
            type: 'object',
            properties: {
                status: { type: 'string', pattern: statusesPattern }
            },
            required: ['status'],
            additionalProperties: false
        }
    },
    required: ['params', 'body']
};