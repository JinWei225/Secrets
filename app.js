//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");
const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

// Setup database
mongoose.connect("mongodb://127.0.0.1:27017/userDB", {useNewUrlParser: true});

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

const secret = "ThisIsOurLittleSecret.";
userSchema.plugin(encrypt,{secret:secret, encryptedFields:["password"]});

const User = new mongoose.model("User", userSchema);


// Home page
app.get("/", function(req,res) {
    res.render("home");
});

// Login page
app.get("/login", function(req,res) {
    res.render("login");
});

// Register page
app.get("/register", function(req,res) {
    res.render("register");
});

// Submit page
app.get("/submit", function(req,res) {
    res.render("submit");
});

// Main Secrets page
app.get("/secrets", function(req,res) {
    res.render("secrets");
});

// User register username and password
app.post("/register", function(req,res) {
    const newUser = new User({
        email:req.body.username,
        password: req.body.password
    });
    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("secrets");
        }
    });
})

// User login
app.post("/login", function(req,res) {
    const username = req.body.username;
    const password = req.body.password;
    
    User.findOne({email:username}, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === password) {
                    res.redirect("secrets");
                }
            }
        }
    })
})

app.listen(3000, function(){
    console.log("Server started on port 3000");
});