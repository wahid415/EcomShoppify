import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const generateTokenTest = (id) => {
  return jwt.sign(
    { id: id, name: "abcd", password: "1234" },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export default generateTokenTest;
