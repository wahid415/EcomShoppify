import asyncHandler from "express-async-handler";
import { protect } from "../middleware/authMiddleware.js";

import Product from "../models/productModel.js";

// @desc    Fetches all the products
// @route   GET /api/products
// @access  public
const getProdcuts = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: "i",
        },
      }
    : {};

  const count = await Product.countDocuments({ ...keyword });

  const products = await Product.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (products) {
    res.json({ products, page, pages: Math.ceil(count / pageSize) });
  } else {
    res.status(404);
    throw new Error("Products not found!");
  }
});

// @desc    Fetches single product By ID
// @route   GET /api/products/:id
// @access  public
const getProdcutById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

// @desc    Delete a product (Admin section)
// @route   Delete /api/admin/product/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed/deleted!" });
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

//@Desc   Create a product
//@Route  POST /api/products
//@Access Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    name: "Sample name",
    price: 0,
    user: req.user._id,
    image: "/images/sample.jpg",
    brand: "Sample brand",
    category: "Sample category",
    countInStock: 0,
    numReviews: 0,
    description: "product as a sample to use",
  });

  const createdProduct = await product.save();

  res.status(201).json(createdProduct);
});

//@Desc   Update a product
//@Route  PUT /api/products/:id
//@Access Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const { name, price, description, image, brand, category, countInStock } =
    req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    (product.name = name),
      (product.price = price),
      (product.description = description),
      (product.image = image),
      (product.brand = brand),
      (product.category = category),
      (product.countInStock = countInStock);

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

//@Desc   Create product review
//@Route  POST /api/products/:id/review
//@Access Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error(`Product already reviewed by ${req.user.name}!`);
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);
    product.numReviews = product.reviews.length;
    product.rating =
      product.reviews.reduce((acc, item) => acc + item.rating, 0) /
      product.reviews.length;

    const postReviewedProduct = await product.save();
    res.status(201).json({ message: "Review added" });
  } else {
    res.status(404);
    throw new Error("Product not found!");
  }
});

//@Desc   Get Top rated Products
//@Route  POST /api/products/top
//@Access Public
const getTopRatedProduct = asyncHandler(async (req, res) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  if (products) {
    res.status(200).json(products);
  } else {
    res.status(404);
    throw new Error("Products not found!");
  }
});

export {
  getProdcuts,
  getProdcutById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopRatedProduct,
};
