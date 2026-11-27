import { asyncHandler } from "../../utils/asyncHandler.js";
import { getMe } from "./user.service.js";
import { ApiError } from "../../utils/ApiError.js";
import { ApiResponse } from "../../utils/ApiResponse.js";
export const getMeController = asyncHandler(async (req, res) => {
    const { sub } = req.user ?? {};
    if (typeof sub !== "string") {
        throw new ApiError(401, "Invalid userId");
    }
    const user = await getMe(sub);
    res
        .status(200)
        .json(new ApiResponse(200, "User fetched successfully", user));
});
