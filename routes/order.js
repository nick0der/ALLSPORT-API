const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const Order = require("../models/Order");
var mongoose = require('mongoose');

//CREATE
router.post("/", async (req, res) => {
  const newOrder = new Order(req.body);

  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json(savedOrder);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    return res.status(200).json(updatedOrder);

  } catch (e) {
    return res.status(500).json(e);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    return res.status(200).json("Order has been deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
});

//GET
router.get("/get/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const order = await Order.find({userId: req.params.userId});
    return res.status(200).json(order);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//GET ALL
router.get("/", verifyTokenAndAdmin, async (req, res) => {

  try {
    const orders = await Order.find();
    return res.status(200).json(orders);
  } catch (e) {
    return res.status(500).json(e);
  }
});

// GET MONTHLY INCOME

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
          ...(productId && {
            products: { $elemMatch: { _id: mongoose.Types.ObjectId(productId) } },
          }),
        },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET OVERALL INCOME

router.get("/allincome", async (req, res) => {
  const productId = req.query.pid;
  const date = new Date();
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    var income = await Order.aggregate([
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$total",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);

    income.sort((a, b) => (a._id > b._id) ? 1 : -1)

    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
