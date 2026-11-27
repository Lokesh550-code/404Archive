import { userModel } from "../../models/user.model.js";
import { ApiError } from "../../utils/ApiError.js";
export const getMe = async (userId) => {
    const user = await userModel.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return {
        userId: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role,
    };
};
