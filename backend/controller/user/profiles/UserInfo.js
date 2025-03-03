import User from "../../../model/User.js";
import asyncError from "../../../utils/asyncError.js";

export const userInfo = asyncError(async (req, res, next) => {
    const { userId } = req
    const userData = await User.findById(userId)
    res.status(200).json({
        message: "Get User Info Succesfully",
        status: "success",
        data: userData
    })
})


export const getAllUsers = asyncError(async (req, res, next) => {
    const { userId } = req
    const userData = await User.find({ _id: { $ne: userId } }).select("-email")
    if (!userData) {
        let err = new CustomError("No User Found!", 204);
        return next(err);
    }
    res.status(200).json({
        message: "Get All User's Data Succesfully",
        status: "success",
        data: userData
    })
})

