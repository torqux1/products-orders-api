const Err = function (code, description, additionalData) {
    this.code = code;
    this.description = description;
    this.additionalData = additionalData;
};

Err.prototype.setCustomMessage = function(customMessage) {
    this.description = customMessage;
    
    return this;
};

module.exports = {
    SUCC_OPERATION: new Err(200, 'Operation successful'),
    SUCC_CREATED: new Err(201, 'Resource created successfully'),
    NOT_AUTHORIZED: new Err(401, 'You don\'t have access. Please pass username and password or token'),
    NOT_FOUND: new Err(404, 'Not found'),
    BAD_REQUEST: new Err(400, 'Bad request'),
    CONFLICT_REQUEST: new Err(409, 'The request could not be completed due to a conflict with the current state of the target resource'),
    NO_SUCH_RESOURCE: new Err(404, 'Resource does not exist'),
    SERVER_ERROR: new Err(500, 'Internal Server Error')
    
};