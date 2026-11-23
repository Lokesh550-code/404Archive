import logger from "../config/logger.js";
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch((error) => {
            logger.error({ err: error });
            next(error);
        });
    };
};
