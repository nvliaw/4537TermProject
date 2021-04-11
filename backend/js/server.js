const express = require("express");
const mysql = require("mysql");
const bcrypt = require("bcrypt");
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

connection.connect((err) => {
    if (err) { throw err; }
    console.log("MySQL: Connected");
});
connection.promise = (sql) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) { reject(new Error()); }
            else { resolve(result); }
        });
    });
};

app.use(function(req, res, next) {
    console.log("IN USE");
    res.header('Access-Control-Allow-Origin', 'https://nvliaw.ca');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(express.json());

// Returns all customers details
app.get('/COMP_4537/term_project/API/v1/customers/:apikey', (req, res) => {
    console.log("IN GET");
    connection.promise("SELECT * FROM apikey where apikey='" +req.params.apikey + "'").then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Customer";
            return connection.promise(sql);
        } else{
            throw '400 Unauthorized: Wrong API Key';
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'GET' AND endpoint = '/API/v1/customers/'", 
            (err, result2) => {
                if (err) throw err});
        res.send(result)
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

// Checks if the user is valid
app.post('/COMP_4537/term_project/API/v1/statistics/', async (req, res) => {
    username = connection.escape(req.body.username);
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    connection.promise("SELECT * FROM User WHERE username=" + username).then((result) => {
        let sql;
        if (result.length == 0){
            throw new Error('405 Invalid username or password');
        } else {
            bcrypt.compare(req.body.password, result[0].password).then(function(result, err){
                if (result){
                    connection.query("SELECT * FROM Statistics", (err, result2) => {
                            if (err) throw err;
                            res.send(result2);
                    });
                } else{
                    throw new Error('405 Invalid username or password');
                }
            }).catch((err) => {
                console.log(err);
                res.status(405).send(err);
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(405).send(err);
    });
});

// Create a new Customer
app.post('/COMP_4537/term_project/API/v1/customers/', (req, res) => {
    fname = connection.escape(req.body.fname);
    lname = connection.escape(req.body.lname);
    email = connection.escape(req.body.email);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Customer WHERE email=" + email;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length > 0){
            throw new Error('401 Inputted email already exists');
        } else{
            sql = "INSERT INTO Customer (fname, lname, email) values(" + fname + ", " + lname + ", " + email + ")";
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'POST' AND endpoint = '/API/v1/customers/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
        }).catch((err) => {
            if (err.message.includes("400")){
                res.status(400).send(err.message);
            } else {
                res.status(401).send(err.message);
            }
        });
    
});

// Update a Customer with the new details
app.put('/COMP_4537/term_project/API/v1/customers/', (req, res) => {
    old_email = connection.escape(req.body.oldEmail)
    new_fname = connection.escape(req.body.newFname);
    new_lname = connection.escape(req.body.newLname);
    new_email = connection.escape(req.body.newEmail)
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Customer WHERE email=" + old_email;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Customer WHERE email=" + new_email;
            return connection.promise(sql);
        } else{
            throw new Error('402 Inputted email does not exist');
        }
    }).then((result) => {
        let sql;
        if (result.length == 0 || old_email == new_email){
            sql = "UPDATE Customer SET `fname`="+ new_fname + ", `lname`=" + new_lname + ", `email`=" + new_email +  "where email=" + old_email;
            return connection.promise(sql);
        } else{
            throw new Error('401 Inputted email already exists');
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'PUT' AND endpoint = '/API/v1/customers/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
    }).catch((err) => {
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else if (err.message.includes("401")){
            res.status(401).send(err.message);
        }
        else {
            res.status(402).send(err.message);
        }
    });
});

// Delete a Customer through their email (which is unique)
app.delete("/COMP_4537/term_project/API/v1/customers/", (req, res) => {
    console.log("IN DELETE")
    email = connection.escape(req.body.email);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Customer WHERE email=" + email;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length == 0){
            throw new Error('402 Inputted email does not exist');
        } else{
            sql = "DELETE FROM `Customer` where email=" + email;
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'DELETE' AND endpoint = '/API/v1/customers/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
    }).catch((err) => {
        console.log(err);
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else if (err.message.includes("402")){
            res.status(402).send(err.message);
        } else {
            res.status(406).send("406 Delete failed: Customer is used in a Booking");
        }
    });
});

// Returns all venues details
app.get('/COMP_4537/term_project/API/v1/venues/:apikey', (req, res) => {
    console.log("IN GET");
    connection.promise("SELECT * FROM apikey where apikey='" +req.params.apikey + "'").then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Venue";
            return connection.promise(sql);
        } else{
            throw '400 Unauthorized: Wrong API Key';
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'GET' AND endpoint = '/API/v1/venues/'", 
            (err, result2) => {
                if (err) throw err});
        res.send(result)
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

// Create a new Venue
app.post('/COMP_4537/term_project/API/v1/venues/', (req, res) => {
    name = connection.escape(req.body.name);
    address = connection.escape(req.body.address);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Venue WHERE venue_name=" + name;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length > 0){
            throw new Error('401 Inputted venue already exists');
        } else{
            sql = "INSERT INTO Venue (venue_name, address) values(" + name + ", " + address + ")";
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'POST' AND endpoint = '/API/v1/venues/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
        }).catch((err) => {
            if (err.message.includes("400")){
                res.status(400).send(err.message);
            } else {
                res.status(401).send(err.message);
            }
        });
});

// Update a Venue with the new details
app.put('/COMP_4537/term_project/API/v1/venues/', (req, res) => {
    old_name = connection.escape(req.body.oldName);
    new_name = connection.escape(req.body.newName);
    new_address = connection.escape(req.body.newAddress);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Venue WHERE venue_name=" + old_name;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Venue WHERE venue_name=" + new_name;
            return connection.promise(sql);
        } else{
            throw new Error('402 Inputted venue does not exist');
        }
    }).then((result) => {
        let sql;
        if (result.length == 0 || old_name == new_name){
            sql = "UPDATE Venue SET `venue_name`="+ new_name + ", `address`=" + new_address + " where venue_name=" + old_name;
            return connection.promise(sql);
        } else{
            throw new Error('401 Inputted venue already exists');
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'PUT' AND endpoint = '/API/v1/venues/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
    }).catch((err) => {
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else if (err.message.includes("401")){
            res.status(401).send(err.message);
        }
        else {
            res.status(402).send(err.message);
        }
    });
});

// Delete a Venue through their venue name (which is unique)
app.delete("/COMP_4537/term_project/API/v1/venues/", (req, res) => {
    console.log("IN DELETE")
    name = connection.escape(req.body.name);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Venue WHERE venue_name=" + name;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length == 0){
            throw new Error('402 Inputted venue does not exist');
        } else{
            sql = "DELETE FROM `Venue` where venue_name=" + name;
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'DELETE' AND endpoint = '/API/v1/venues/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
    }).catch((err) => {
        console.log(err);
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else if (err.message.includes("402")){
            res.status(402).send(err.message);
        } else {
            res.status(406).send("406 Delete failed: Venue is used in a Booking");
        }
    });
});

// Returns all bookings details
app.get('/COMP_4537/term_project/API/v1/bookings/:apikey', (req, res) => {
    console.log("IN GET");
    connection.promise("SELECT * FROM apikey where apikey='" +req.params.apikey + "'").then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Booking INNER JOIN Customer on Customer.c_id = Booking.c_id INNER JOIN Venue on Venue.venue_id = Booking.venue_id";
            return connection.promise(sql);
        } else{
            throw '400 Unauthorized: Wrong API Key';
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'GET' AND endpoint = '/API/v1/bookings/'", 
            (err, result2) => {
                if (err) throw err});
        res.send(result)
    }).catch((err) => {
        console.log(err);
        res.status(400).send(err);
    });
});

// Returns one booking with the inputted booking id
app.get('/COMP_4537/term_project/API/v1/bookings/booking/:id/:apikey', (req, res) => {
    console.log("IN GET");
    connection.promise("SELECT * FROM apikey where apikey='" +req.params.apikey + "'").then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Booking WHERE b_id=" + req.params.id;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        if (result.length == 0){
            throw '402 Inputted booking does not exist';
        } else {
            sql = "SELECT * FROM Booking INNER JOIN Customer on Customer.c_id = Booking.c_id INNER JOIN Venue on Venue.venue_id = Booking.venue_id WHERE b_id = " + req.params.id;
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'GET' AND endpoint = '/API/v1/bookings/'", 
            (err, result2) => {
                if (err) throw err
            });
        res.send(result)
    }).catch((err) => {
        console.log(err);
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else {
            res.status(402).send(err.message);
        }
    });
});

// Create a new Booking
app.post('/COMP_4537/term_project/API/v1/bookings/', (req, res) => {
    date = connection.escape(req.body.date);
    v_id = connection.escape(req.body.v_id);
    c_id = connection.escape(req.body.c_id);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Booking WHERE booking_date=" + date + " AND venue_id=" + v_id;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length > 0){
            throw new Error('401 Inputted booking for this venue already exists');
        } else{
            sql = "INSERT INTO Booking (booking_date, venue_id, c_id) values(" + date + ", " + v_id + ", " + c_id + ")";
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'POST' AND endpoint = '/API/v1/bookings/'",
        (err, result2) => {
            console.log(err);
            if (err) throw err
        });
        res.send(result);
    }).catch((err) => {
        console.log(err);
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else {
            res.status(401).send(err.message);
        }
    });
});

// Delete a Booking through their booking ID (which is unique)
app.delete("/COMP_4537/term_project/API/v1/bookings/", (req, res) => {
    console.log("IN DELETE")
    b_id = connection.escape(req.body.b_id);
    apikey = connection.escape(req.body.apikey);
    connection.promise("SELECT * FROM apikey where apikey=" + apikey).then((result) => {
        let sql;
        if (result.length > 0){
            sql = "SELECT * FROM Booking WHERE b_id=" + b_id;
            return connection.promise(sql);
        } else{
            throw new Error('400 Unauthorized: Wrong API Key');
        }
    }).then((result) => {
        let sql;
        if (result.length == 0){
            throw new Error('402 Inputted booking does not exist');
        } else{
            sql = "DELETE FROM `Booking` where b_id=" + b_id;
            return connection.promise(sql);
        }
    }).then((result) => {
        connection.query("UPDATE Statistics SET requests = requests + 1 WHERE method = 'DELETE' AND endpoint = '/API/v1/bookings/'",
        (err, result2) => {
            if (err) throw err});
        res.send(result)
    }).catch((err) => {
        console.log(err);
        if (err.message.includes("400")){
            res.status(400).send(err.message);
        } else {
            res.status(402).send(err.message);
        }
    });
});

app.get("*", (req, res) => {
    res.status(404).send("404 Page not found");
})

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
})
