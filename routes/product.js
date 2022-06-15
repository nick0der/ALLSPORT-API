const router = require("express").Router();
const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const User = require("../models/User");
const Product = require("../models/Product");
const Order = require("../models/Order");

//ADD
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);

  try {
    const savedProduct = await newProduct.save();
    return res.status(200).json(savedProduct);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {

  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    // console.log(updatedProduct);
    console.log("BODY IS: ");
    console.log(req.body);
    return res.status(200).json(updatedProduct);

  } catch (e) {
    return res.status(500).json(e);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.status(200).json("Product has been deleted");
  } catch (e) {
    return res.status(500).json(e);
  }
});

//GET
router.get("/get/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    return res.status(200).json(product);
  } catch (e) {
    return res.status(500).json(e);
  }
});

//GET ALL
router.get("/", async (req, res) => {

  const qNew = req.query.new;
  const qCategory = req.query.category;

  try {

    let products;
    console.log(qNew);

    if (qNew === "true") {
      products = await Product.find().sort({createdAt: -1}).limit(3);
    } else if (qCategory){
      products = await Product.find({categories:{
        $in:[qCategory],
        }
      });
  } else {
    products = await Product.find();
  }

    return res.status(200).json(products);
  } catch (e) {
    return res.status(500).json(e);
  }
});


//GET TOTAL SOLD
router.get("/totalSold/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();

    var total = 0;
    orders.forEach((order) => {
      var sum = order.products.reduce((accumulator, product) => {
        var value = req.params.id === product._id.toHexString() ? product.quantity : 0;
        return accumulator + value;
      }, 0);
      console.log(sum);
      total += sum;
      console.log(total);
    });

    return res.status(200).json(total);
  } catch (e) {
    return res.status(500).json(e);
  }
});

module.exports = router;
