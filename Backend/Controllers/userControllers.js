const User = require('../Models/UserModel');
const generateToken = require('../config/generateToken');
const bcrypt = require('bcrypt');


const register = async (req, res) => {
    const { name, email, password, pic } = req.body;
    try {

        if (name === undefined || email === undefined || password === undefined || pic === undefined) {
            return res.status(400).json({ success: false, msg: "Please Enter all the Feilds" });
            //throw new Error("Please Enter all the Feilds;");
        }

        const existUser = await User.findOne({ email });
        if (existUser) {
            return res.status(400).json({ success: false, msg: "User already Exists" });
            //throw new Error("User already Exists");
        }
        /* if (password !== confirmPassword) {
             return res.status(400).json({ success: false, msg: "Password and Confirm Password does not match" });
             // throw new Error("Password and Confirm Password does not match");
         }*/
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        //const user = new User(req.body);
        const user = new User({
            name,
            email,
            pic,
            password: hashedPassword
        });
        await user.save(); // Save the user to the database
        if (user) {
            return res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id),
            });

        }
        else {
            return res.status(400).json({ success: false, msg: "Failed to Create the User" });
            //throw new Error("Failed to Create the User");
        }
    }
    catch (err) {
        console.error(err); // Log the error message to console
        return res.status(500).json({ success: false, error: err.message }); // Return the error message in the response
    }
}

const authUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        if (email === undefined || password === undefined) {
            return res.status(400).json({ success: false, msg: "Please Enter all the Feilds" });
        }
        const userExist = await User.findOne({ email });
        if (!userExist) {
            return res.status(400).json({ success: false, msg: "User does not Exists" });
        }

        // console.log(userExist, ".....................");
        const isMatch = await bcrypt.compare(password, userExist.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, msg: "Invalid Password" });
        }
        else {
            return res.status(201).json({
                success: true,
                _id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                pic: userExist.pic,
                token: generateToken(userExist._id),
            });
        }

    }
    catch (err) {
        console.error(err); // Log the error message to console
        return res.status(500).json({ success: false, error: err.message }); // Return the error message in the response
    }
}
/*
//api/user?search=tarun
const allUsers = async (req, res) => {

    try {
        let query = {};

        if (req.query.search) {
            const keyword = req.query.search;
            query = {
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { email: { $regex: keyword, $options: "i" } }
                ]
            };
        }
        /*console.log(query);
        console.log(query.$or[0].name);
        console.log(query.$or);*/
/*
        const users = await User.find(query);
        console.log(users);
    }
    catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }

}
*/

const allUsers = async (req, res) => {
    try {
        let query = {};

        if (req.query.search) {
            const keyword = req.query.search;
            query = {
                $or: [
                    { name: { $regex: keyword, $options: "i" } },
                    { email: { $regex: keyword, $options: "i" } }
                    // { name: { $regex: `^${keyword}$`, $options: "i" } }, // Match exact name with leading and trailing spaces ignored
                ],
                _id: { $ne: req.user._id } // Exclude the current user
            };
        }

        // const users = await User.find(query).find({ _id: { $ne: req.user._id} });
        const users = await User.find(query);
        //console.log(query);
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, authUser, allUsers };