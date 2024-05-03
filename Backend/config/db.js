const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = async () => {
    try {
        const connected = await mongoose.connect(process.env.MONGO_URL, {
            /*   useNewUrlParser: true,
               useUnifiedTopology: true,*/
        });
        console.log(`MongoDB Connected ${connected.connection.host}`.cyan.underline);
    }
    catch (err) {
        console.log(`Error : ${err.message}`.red.bold);
        process.exit();
    }
}

module.exports = connectDB;