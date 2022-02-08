import jwt from "jwt";
import dotenv from "dotenv";
import asyncHandler from "express-async-handler";

import User from "../models/userModel.js";

dotenv.config();

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      req.user = user;
    } catch (error) {}
  }
});
