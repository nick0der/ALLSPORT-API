const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: false, unique: false },
    lastName: { type: String, required: false, unique: false },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    wishlist: { type: Array, required: false },
    cart: { type: Object, required: false },
    isAdmin: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", UserSchema);
