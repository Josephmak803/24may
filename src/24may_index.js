//Importing modules 
const express = require("express");
const path = require("path");
const bcrypt = require("bcrypt");

//Importing database modules from config.js (User, Product, Admin)
//Product added on 12may
//Admin added on 22may
const { User, Product, Admin } = require("./config");

//Connection this page with all the expree pages
const app = express();

//Middleware to parse incoming request data(json and form-encoded/Url)
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//Set up ejs file and the view engine and define view directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//Set up public files such as (CSS, Javascript, images)
app.use(express.static(path.join(__dirname, 'public')));

//-------------------------------- for page rendering -----------------------------------------------
//render login page as the default
app.get("/", (req, res) => {
    res.render("login"); 
});

//render login page
app.get("/login", (req, res) => {
    res.render("login"); 
});

//render register page 
app.get("/signup", (req, res) => {
    res.render("signup"); 
});

//render personal information page
//10may personal page is added
app.get("/personal", (req,res)=>{
    res.render("personal")
});

//render payment page
//15may payment page is added 
app.get("/payment", (req,res)=>{
    res.render("payment")
});

//render admin page
//22 may admin function is added
app.get("/admin", (req,res)=>{
    res.render("admin")
});

//-------------------------------- Homepage(after login) -----------------------------------------------

//12may
app.get("/home", async (req, res) => {
    try {
        //Fetching products from database
        const products = await Product.find();
        res.render("home", { products, name: "User" }); 
    } catch (error) {
        console.error("Error fetching products:", error);
        res.send("Error loading home page.");
    }

    
});

//-------------------------------- Register function -----------------------------------------------

//8may user sign up and hashing
app.post("/signup", async (req, res) => {
    const { username, password, confirmedPassword } = req.body;

    if (password !== confirmedPassword) {
        return res.send("Please make sure your password aligns with your confirmed password.");
    }

    const existingUser = await User.findOne({ name: username });
    if (existingUser) {
        return res.send("User already exists. Please choose a different username.");
    }

    // Hash the password before storing
    const saltRounds = 10;
    const hashPassword = await bcrypt.hash(password, saltRounds);

    const data = {
        name: username,
        password: hashPassword
    };

    const userdata = await User.create(data); //save new user
    console.log(userdata);
    res.render("personal"); //redirecting to presonal info page
});

//-------------------------------- Personal info function ---------------------------------------------

//10th may personal page function is added for extra user info 
app.post("/personal", async (req, res) => {
    const { email_address, phone_number, license_number } = req.body;
    //get last registered user
    const lastUser = await User.findOne().sort({ _id: -1 }); 

    if (!lastUser) return res.send("No user to update.");
    //add personal infor to the user document
    lastUser.email_address = email_address;
    lastUser.phone_number = phone_number;
    lastUser.license_number = license_number;

    await lastUser.save(); //save updates

    res.render("login"); //return to login
});

//-------------------------------- Login function ---------------------------------------------

//8th may  
app.post("/login", async (req, res) => {
    try {
        const check = await User.findOne({ name: req.body.username });

        if (!check) {
            return res.send("Username cannot be found!");
        }

        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        
        if (isPasswordMatch) {
            const products = await Product.find();
            res.render("home", 
            //added on the 10 may allow the username to be rendered and transmitted to the home page
                    { name: check.name, products });
        } else {
            res.send("Wrong password");
        }

    } catch (error) {
        console.error(error); // helps with debugging
        res.send("Something went wrong during login");
    }
});

//-------------------------------- Admin login function ---------------------------------------------

//22may 
app.post("/admin", async (req, res) => {
    try {
        const check = await Admin.findOne({ admin_name: req.body.username });

        if (!check) {
            return res.send("Admin name cannot be found!");
        }

        if (req.body.password === check.admin_password) {
            const products = await Product.find(); // Get all products from DB
            res.render("adminhome", { name: check.admin_name, products }); // Pass products to EJS
        } else {
            res.send("Wrong password");
        }

    } catch (error) {
        console.error(error);
        res.send("Something went wrong during admin login");
    }
});

//-------------------------------- Admin update function ---------------------------------------------

//23may update button work and admin can directly change the price and stock adminhome page 
app.post("/adminhome", async (req, res) => {
    try {
        
        const products = req.body.products; // array of product updates

        for (const item of products) {
            await Product.findByIdAndUpdate(item.id, {
                price: item.price,
                stock: item.stock
            });
        }

        // Fetch updated products to render again
        const updatedProducts = await Product.find();
        res.render("adminhome", { name: "Admin", products: updatedProducts });
    } catch (error) {
        console.error("Error updating products:", error);
        res.status(500).send("Server error while updating products. Please check the input of the homepage");
    }
});

//-------------------------------- Server ---------------------------------------------

const port = 3000;
app.listen(port, () => {
    console.log(`Server running on Port: ${port}`);
});