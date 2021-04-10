const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8888;
const app = express();
const endPointRoot = "/API/v1/";

const connection = mysql.createConnection({
    host: "localhost",
    user: "henryliu_nodemysql",
    password: "testing",
    database: "henryliu_termproject",
    multipleStatements: true
});

app.use(function(req, res, next) {
    console.log("IN USE");
    // console.log(req);
    // console.log(req.originalUrl);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(express.json());

// Returns all customers details
app.get('/COMP_4537/term_project/API/v1/customers/', (req, res) => {
     console.log("IN GET");
    // console.log(req);
    // console.log(req.originalUrl);
    connection.query("SELECT * FROM Customer; UPDATE Statistics SET requests = requests + 1 WHERE method = 'GET' AND endpoint = '/API/v1/customers/'",
    (err, result) => {
        if (err) throw err;
        res.send(result[0]);
    })
});

// Returns all statistics
app.get('/COMP_4537/term_project/API/v1/statistics/', (req, res) => {
    connection.query("SELECT * FROM Statistics",
    (err, result) => {
        if (err) throw err;
        res.send(result);
    })
});

// Create a new Customer
app.post('/COMP_4537/term_project/API/v1/customers/', (req, res) => {
    console.log(req.route);
    console.log("Sending a POST request...");
    fname = connection.escape(req.body.fname);
    lname = connection.escape(req.body.lname);
    email = connection.escape(req.body.email);
    connection.query("INSERT INTO Customer (fname, lname, email) values(" + fname + ", " + lname + ", " + email + "); UPDATE Statistics SET requests = requests + 1 WHERE method = 'POST' AND endpoint = '/API/v1/customers/'",
    (err, result) => {
        if (err){
            throw err;
        };
        console.log(result);
    });
});

// Update a Customer with the new details
app.put('/COMP_4537/term_project/API/v1/customers/', (req, res) => {
    console.log(req.route);
    old_fname = connection.escape(req.body.oldFname);
    old_lname = connection.escape(req.body.oldLname);
    old_email = connection.escape(req.body.oldEmail)
    new_fname = connection.escape(req.body.newFname);
    new_lname = connection.escape(req.body.newLname);
    new_email = connection.escape(req.body.newEmail)
    // Only update the quote
    connection.query("UPDATE Customer SET `fname`="+ new_fname + ", `lname`=" + new_lname + ", `email`=" + new_email +  "where fname=" + old_fname + " AND lname=" + old_lname +  " AND email=" + old_email + "; UPDATE Statistics SET requests = requests + 1 WHERE method = 'PUT' AND endpoint = '/API/v1/customers/'",
    (err, result) => {
        if (err){
            throw err;
        };
        console.log(result);
    });
});

// Delete a Customer through their email (which is unique)
app.delete("/COMP_4537/term_project/API/v1/customers/", (req, res) => {
    email = connection.escape(req.body.email);
    connection.query("DELETE FROM `Customer` where email=" + email + "; UPDATE Statistics SET requests = requests + 1 WHERE method = 'DELETE' AND endpoint = '/API/v1/customers/'", (err, result) => {
        if (err) throw err;
        res.send(result);
    });
});

// app.get(endPointRoot + resource + "1", (req, res) => {
//     console.log(req.route);
//     connection.query("SELECT * FROM quotes ORDER BY id DESC LIMIT 1", (err, result) => {
//         if (err) throw err;
//         res.send(result);
//     });
// });

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
})
