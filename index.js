const express = require("express");
const app = express();
const mongoose = require("mongoose");
// const Schema = mongoose.Schema;
const dotenv = require('dotenv');
const userRoute = require("./routes/user"); 
const authRoute = require("./routes/auth"); 
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe")
const cors = require("cors");

const path = require('path');

dotenv.config();

mongoose.connect(process.env.MONGO_URL)
        .then(()=> {})
        // .then(()=> console.log("DB Connection Successful"))
        .catch((err)=>console.log(err));

app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, './client/dist')))

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute); 

app.use('*',function(req, res) {
    res.sendFile(path.join(__dirname, "./front-end/dist/index.html"))
})

app.listen(8080,()=>{
    // console.log("listening to port 8080");
})