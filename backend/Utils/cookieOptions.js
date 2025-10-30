const cookieOptions = (req) =>{
    const isProduction = process.env.NODE_ENV === "production"

    return {
        httpOnly: true,
        secure:isProduction && req.hostname !== "localhost",
        sameSite: "Strict",
        path: "/",
        sameSite: "lax",
        maxAge: 24 * 60 * 60 * 1000 //satu hari
    }
}

module.exports = cookieOptions;