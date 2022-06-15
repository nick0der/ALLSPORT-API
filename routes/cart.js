const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Cart = require("../models/Cart");

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const savedCart = await newCart.save();
    return res.status(200).json(savedCart);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedCart);

  } catch (e) {
    return res.status(500).json(e);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    return res.status(200).json("Cart has been deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
});

//GET
router.get("/get/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({userId: req.params.userId});
    return res.status(200).json(cart);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {

  try {
    const carts = await Cart.find();
    return res.status(200).json(carts);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
