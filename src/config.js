//import mongoose to handle mongoDB connection
const mongoose = require("mongoose");

// Connect to the local MongoDB database called "software_project"
const connect = mongoose.connect("mongodb://localhost:27017/software_project");

//for error handling
connect.then(() => {
    console.log("Database connected Successfully");
})
.catch(()=>{
    console.log("Database cannot be connected");
})

// ---------------------------- User Schema ----------------------------
//10thmay for personal info is added
//required fields: name and password
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    email_address: { type: String },       
    phone_number: { type: String },
    license_number: { type: String }
});
//create a model for user
const User = mongoose.model("User", userSchema);

// ---------------------------- Admin Schema ----------------------------
//22may admin funciton added to fletch from the database
const adminSchema = new mongoose.Schema({
    admin_name: { type: String, required: true },
    admin_password: { type: String, required: true }
}, { collection: "admin" }); 

//create a model for admin 
const Admin = mongoose.model("Admin", adminSchema);

// ---------------------------- Prodcut Schema ----------------------------

//12may where elements of the products are directly called from the database
const productSchema = new mongoose.Schema({
    name: String,
    image: String,
    price: Number,
    stock: Number,
  });
//create a model for product
const Product = mongoose.model("Product", productSchema);

// ---------------------------- Export model ----------------------------
module.exports = {
    User,
    /*12may Product elements are exported to index.js */
    Product,
    /*22th admin elements are exported to index.js*/
    Admin,
};


