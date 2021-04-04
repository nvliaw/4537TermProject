const express = require("express");
const mysql = require("mysql");
const PORT = process.env.PORT || 8888;
const app = express();
const endPointRoot = "/API/v1";

const connection = mysql.createConnection({
    host: "localhost",
    user: "nvliawca_nvliaw",
    password: "nvliaw",
    database: "nvliawca_nodequotesql"
});

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    next();
});

app.use(express.json());

app.get("*", (req, res) => {
    console.log(req);
    connection.query("SELECT * FROM quote", (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.get(endPointRoot + "/1", (req, res) => {
    console.log(req);
    connection.query("SELECT * FROM quote order by quoteid desc", (err, result) => {
        if (err) throw err;
        res.send(JSON.stringify(result));
    });
});

app.post("*", (req, res) => {
    let sql = "INSERT INTO quote(quoteText, authorText) values(" + connection.escape(req.body.quoteText) + ", " + connection.escape(req.body.quoteAuthor) + ");";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Successfully added.");
    });
});

app.put("*", (req, res) => {
    let sql = "UPDATE quote SET quoteText = " + connection.escape(req.body.newQuote) + ", authorText = " + connection.escape(req.body.newAuthor) + " WHERE quoteText = " + connection.escape(req.body.oldQuote) + " AND authorText = " + connection.escape(req.body.oldAuthor) + ";";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Successfully updated.");
    });
});

app.delete("*", (req, res) => {
    let sql = "DELETE FROM quote WHERE quoteText = " + connection.escape(req.body.quoteText) + " AND authorText = " + connection.escape(req.body.quoteAuthor) + ";";
    connection.query(sql, (err, result) => {
        if (err) throw err;
        res.send("Successfully deleted.");
    });
});

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log("Listening to port", PORT);
})

console.log(app.routes);