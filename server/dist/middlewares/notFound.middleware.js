import { ApiResponse } from "../utils/ApiResponse.js";
export const notFound = (req, res) => {
    res.status(404).json(new ApiResponse(404, `Requested url not available`, {
        requestedUrl: req.originalUrl,
    }));
};
