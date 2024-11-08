import { User } from "../models/user.models.js";
import { ApiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";

const genarateTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const refreshToken = user.genarateRefreshToken();
   
    const accessToken = user.genarateAccessToken();
    user.refreshToken = refreshToken;
    user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (err) {
    throw new ApiError(500, "Something went's Wrong");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (
    [ email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "all fields are required! ");
  }

  const userIsexsits = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (userIsexsits) throw new ApiError(409, "User is already registered");

  const newUser = await User.create({  email, username, password });

  if (!newUser)
    throw new ApiError(400, "Something went's wrong, while creating user!");

  const { _id: id } = newUser;
  const updatedUser = await User.findById(id).select([
    "-password",
    "-refreshToken",
  ]);

  res.status(200).send(updatedUser);
});

export const Login = asyncHandler(async (req, res) => {
  const {username, email, password} = req.body;

  const findUserByIndetifier = await User.findOne({
    $or: [{username}, {email}]
  });

  if (!findUserByIndetifier)
    throw new ApiError(404, "User not found please Sign up before sign in!");
  
  const verifyByPassword = findUserByIndetifier.password === password;

  if (!verifyByPassword) throw new ApiError(404, "Invalid candidate");

  const { refreshToken, accessToken } = await genarateTokens(findUserByIndetifier._id);
   
  
  const updateUser = await User.findById(findUserByIndetifier._id).select([
    "-password",
    "-refreshToken",
  ]);
  
  const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  }

  res.status(200).cookie("ref", refreshToken, cookieOptions).cookie('ac', accessToken, cookieOptions).send({user: updateUser})
})

export const getUser =  asyncHandler(async(req, res) => {
  const userId = req.user;
  // console.log(userId._id);
  const user = await User.findById(userId._id);
  
  res.status(200).send({user: user})
})