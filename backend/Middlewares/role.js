const { errorResponse } = require("../Utils/response")

const roleMiddleware = (roles) =>{
    return (req, res, next) =>{
        if(!roles.includes(req.user.role)){
            return errorResponse(res, `forbidden: role mismatch, must role is: ${roles}`)
        }
        next();
    };
};

module.exports = roleMiddleware