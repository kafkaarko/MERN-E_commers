const jwt = require('jsonwebtoken');
const { errorResponse } = require('../Utils/response');

// const JSON_SECRET = process.env.JWT_SECRET ;

 const verifyToken = (req, res, next) =>{
    let token;
    const authHeader = req.headers.authorization
    if(authHeader) token = authHeader.split(" ")[1];
    if(!token && req.cookies?.token) token = req.cookies.token //agar bisa login menggunakan cookie
    
    if(!token) return errorResponse(res , "access denied, please login first", {message: "login first"})

    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decode;
        next();
    } catch (error) {
        errorResponse(res, error.message,null)
    }
}
module.exports = verifyToken