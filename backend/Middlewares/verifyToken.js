const jwt = require('jsonwebtoken');
const { errorResponse } = require('../Utils/response');

// const JSON_SECRET = process.env.JWT_SECRET ;

 const verifyToken = (req, res, next) =>{
    const authHeader = req.headers.authorization
    if(!authHeader) return errorResponse(res, "access denied, please login first", {error: "Token Required"})

    const token = authHeader.split(" ")[1];

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        errorResponse(res, error.message,null)
    }
}
module.exports = verifyToken