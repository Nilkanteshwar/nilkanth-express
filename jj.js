const express = require("express");
const path = require("path");
const app = express();
const port = 3000;
const mysql = require("mysql");
const { body, check, validationResult } = require("express-validator");
const router = express.Router();
const cors = require("cors");

app.use(express.json());
app.use(cors());

// Sending the registration page.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/index.html"));
});
app.use(express.static(__dirname + "/public"));

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname + "/login.html"));
});

app.use(
  express.urlencoded({
    extended: true,
  })
);

// *********************************
var pool_con = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "nilkant",
});

pool_con.getConnection(function (err) {
  if (!err) {
    console.log("Database connection successful!");
    return true;
  } else {
    console.log(err);
    console.log("Database connection failed!");
    return false;
  }
});

app.post("/user", (req, res) => {
  // console.log(req.body);

  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var Cpassword = req.body.Cpassword;
  var gender = req.body.gender;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.send(errors.errors[0].msg);
  } else if (req.body.password !== req.body.Cpassword) {
    res.send("Password confirmation does not match password!");
  } else {
    var Duplicate_data = `SELECT * from nilkey WHERE email='${email}'`;
    pool_con.query(Duplicate_data, (err, result) => {
      if (result && result[0]) {
        res.send("Duplicate data found!");
      } else {
        // Data insertion query.
        var add_new_data = `INSERT INTO nilkey (username, email, password,gender) VALUES ("${username}","${email}","${password}","${gender}")`;
        pool_con.query(add_new_data, (err, result) => {
          res.send("Validation Successful!");
        });
      }
    });
  }
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  //query to check if the user exists or not
  var check_user = `SELECT * from nilkey WHERE email='${email}' AND password='${password}'`;
  pool_con.query(check_user, (err, result) => {
    if (result && result[0]) {
      res.json({
        status: true,
        message: "Login Successful!",
      });
    } else {
      res.json({
        status: false,
        message: "Invalid Credentials!",
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Your App is running on port ${port}!`);
});
