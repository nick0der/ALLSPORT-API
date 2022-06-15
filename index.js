const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const orderRoute = require("./routes/order");
const cartRoute = require("./routes/cart");



dotenv.config();

mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(()=>console.log("DBConnection is successfull"))
  .catch((err)=>console.log(err));

app.use(express.json());
app.use(cors());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/order", orderRoute);
app.use("/api/cart", cartRoute);

app.listen(process.env.PORT || 5000, ()=>{
  console.log("Backend server is running");
});
