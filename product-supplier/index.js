require("dotenv").config({ path: ".env" });
var express = require("express");
var bodyParser = require("body-parser");
var multer = require("multer");
const path = require("path");
const { Product, Order } = require("./database/models");

var upload = multer();
var app = express();
const apiUrl = "/api/v1";

// for parsing application/json
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: true });
app.use(upload.array());

app.get("", (req, res) => {
  return res.sendFile(path.join(__dirname + "/index.html"));
});

app.get(`/products`, (req, res) => {
  res.sendFile(path.join(__dirname + "/products.html"));
});

app.get(`${apiUrl}/products`, (req, res) => {
  Product.find({}, (err, products) => {
    if (err) {
      return res.json({ error: "Error occurred during fetching products" });
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    return res.json({ products });
  });
});

app.get(`${apiUrl}/product/:id`, (req, res) => {
  Product.findOne({ _id: req.params.id }, (err, product) => {
    if (err) {
      return res.json({ error: "Error occurred during fetching products" });
    }
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    return res.json({ product });
  });
});

app.post(`${apiUrl}/addProduct`, urlencodedParser, (req, res) => {
  const { name, category, description, price } = req.body;

  const product = new Product({
    name,
    category,
    price,
    description,
  });
  product.save(function (err) {
    if (err) {
      return res.send("Error occurred, product saved failed. try again!");
    }
    res.send("Product saved successfully!");
  });
});

app.post(`${apiUrl}/createOrder`, urlencodedParser, (req, res) => {
  const { products, address, transactionId, amount } = req.body;

  const order = new Order({
    products,
    address,
    transactionId,
    amount,
  });
  order.save(function (err) {
    if (err) {
      return res.send("Error occurred, order creation failed. try again!");
    }
    res.send("Order created successfully!");
  });
});

app.listen(4000);
