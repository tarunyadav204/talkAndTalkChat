const jwt = require('jsonwebtoken');
const User = require('../Models/UserModel');

const protect = async (req, res, next) => {
    let token;

    try {

        if (req.user) {
            return next();
        }

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {

            token = req.headers.authorization.split(" ")[1];

            const decode = jwt.verify(token, process.env.JWT_SECRET);
            //console.log(decode, "....Decode......");
            //Find user associated with decode id
            //req.user = await User.findById(decode.id).select("-password");
            req.user = await User.findById(decode.id).select("-password");

            //console.log(req.user);
            return next();
        }
    }
    catch (error) {
        console.error(error);
        return res.status(401).json({ success: false, error: "Not authorized, token failed" });
    }

    if (!token) {
        return res.status(401).json({ success: false, msg: "Not authorized, no token" });
    }
}

module.exports = { protect };