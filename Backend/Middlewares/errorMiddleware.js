const { status } = require("express/lib/response");

/*
const notFound = (req, res, next) => {
    const error = {
        statusCode: 404,
        message: `Not Found - ${req.originalUrl}`
    };

    next(error);
}

const errorHandler = (error, req, res, next) => {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";

    res.status(statusCode).json({
        success: false,
        error: message
    });
}

module.exports = { notFound, errorHandler };
*/
const notFound = (req, res, next) => {
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);

    next(error);
}

const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || "Internal Server Error";

    // Log statusCode and message
    /*  console.log(res.statusCode, "...........");
      console.log("Status Code:", statusCode);
      console.log("Message:", message);
      console.log("...........", err.stack);*/
    res.status(statusCode);
    res.json({
        message: message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack
    });
}

module.exports = { notFound, errorHandler };