const bcrypt = require('bcrypt');
const uuid = require('uuid');
const jwt = require('jsonwebtoken')

const ResponseCodes = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
  };

// constants
module.exports.constants = {
    bcrypt,
    uuid,
    jwt,
    Jwt_Secret: 'hfcja@#jkj3$%kN&',
    ResponseCodes
}