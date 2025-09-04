const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse, errorResponse } = require("../Utils/response.js");
const cookieOptions = require("../Utils/cookieOptions.js");
const User = require("../Model/UserModel.js")


//register
const register = async(req, res) =>{
    const {name, email, password, role} = req.body;

    //cek email apakah ada atau tidak
    const existed = await User.findOne({email});
    if(existed) return errorResponse(res, "Email has been taken", null);

    //hash the password

    const hashedPassword = await bcrypt.hash(password, 10);

    //simpan doc ke db
    try {
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role
        })
        return successResponse(res, "User created successfully", {
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        })
    } catch (error) {
        return errorResponse(res, "something went wrong", {message: error.message})
    }
}

const login = async(req, res) =>{
    const {email, password} = req.body;

    //cari user
    const user = await User.findOne({email:email});
    if(!user) return errorResponse(res, "email not found, please try again",null);

    //cocokan passwor user
    const match = await bcrypt.compare(password, user.password);
    if(!match) return errorResponse(res, "wrong password, please try again",null);

    //buat jwt agar mendapatkan akses
    
    const token = jwt.sign({id: user.id, role:user.role}, process.env.JWT_SECRET, {expiresIn: "1d"});

    res.cookie("token", token, cookieOptions(req));

    return successResponse(res, "Login successful", ({
        userId: user.id,
        email: email,
        role: user.role,
        token: token
    }));
}

const logout = async(req, res) =>{
    res.clearCookie("token", {
        ...cookieOptions(req),
        maxAge: undefined, //agar cookie terhapus
    });

    return successResponse(res, "logout succefuly")
}

const toSeller = async(req, res) =>{
    const user = await User.findById({_id:req.user.id})
    if(!user) return errorResponse(res, "must login first !", null)

    if(user.role == "seller") return errorResponse(res, "you have become a seller", null)

    try {
        const changeUser = await User.findByIdAndUpdate({_id:req.user.id},{role: "seller"})
        return successResponse(res, "success to become seller", changeUser);
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
        
    }
    
}

const toWAREHOUSE = async(req, res) =>{
    const user = await User.findById({_id:req.user.id})
    if(!user) return errorResponse(res, "must login first !", null)

    if(user.role == "warehouse") return errorResponse(res, "you have become a warehouse", null)

    try {
        const changeUser = await User.findByIdAndUpdate({_id:req.user.id},{role: "warehouse"})
        return successResponse(res, "success to become warehouse", changeUser);
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
        
    }
    
}

const toCourier = async(req, res) =>{
    const user = await User.findById({_id:req.user.id})
    if(!user) return errorResponse(res, "must login first !", null)

    if(user.role == "courier") return errorResponse(res, "you have become a courier", null)

    try {
        const changeUser = await User.findByIdAndUpdate({_id:req.user.id},{role: "courier"})
        return successResponse(res, "success to become courier", changeUser);
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
        
    }
    
}

const user = async(req, res) =>{
    try {
        const user = await User.findById({_id:req.user.id})
        console.log(user)
    if(!user) return errorResponse(res, "login first!!", null)
    return successResponse(res, "your profile", user) 
    } catch (error) {
        return errorResponse(res, "something wrong, please try again", {message: error.message})
        
    }

}   

module.exports = { register, login, logout, toSeller, user, toCourier, toWAREHOUSE} ;
