import express from "express";
import multer from "multer";
import path from "path";

import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `${file.fieldname} - ${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb("Images only!");
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

// router.post("/", protect, admin, upload.single("image"), (req, res) => {
//   console.log(req.file.path);
//   res.send(`/${req.file.path.replace("\\", "/")}`);
// });

const errorHandler = (err, req, res, next) => {
  //error handler gets called only when catches error
  if (err instanceof multer.MulterError) {
    res.status(400);
  }
  next(err); //redirect to custom error handler
};

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  errorHandler,
  (req, res) => {
    if (!req.file) {
      res.status(400);
      throw new Error("Please select file"); //catch by custom error handler
      //next(new Error('Please select file')) //mandatory if inside async function otherwise use express-async-handler which will also redirect implicit errors to custom error handler
    }

    res.send(`/uploads/${req.file.filename}`); //replace '\' with '/' because windows supoorts '\' as directory separator
  }
);

export default router;
