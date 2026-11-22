import { ApiError } from "../utils/ApiError.js";
export const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = "Internal server error";
    let errors = [];
    if (err instanceof ApiError) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    res.status(statusCode).json({
        statusCode: statusCode,
        success: false,
        message: message,
        errors: errors,
    });
};
