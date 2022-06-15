const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    name: { type: String, required: true},
    lastName: { type: String, required: true},
    phone: { type: String, required: true},
    products: { type: Array, required: true},
    total: { type: Number, required: true },
    address: { type: Object, required: true },
    status: { type: String, default: "pending"},
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Order", OrderSchema);
