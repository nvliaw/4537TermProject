const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();
const incompleteBooking = "Please ensure all booking details are selected."
const duplicateBooking = "This date has already been booked for this venue. Select a different date."
const apikey = "MyAppKey";

function Button(name, colour) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = name;
    this.btn.style.backgroundColor = colour;
}

function Customer(id, fname, lname, email) {
    this.id = id;
    this.fname = fname;
    this.lname = lname;
    this.email = email;
}

function Venue(id, name, address) {
    this.id = id;
    this.name = name;
    this.address = address;
}

function Booking(b_id, c_id, v_id, customerName, venueName, date) {
    this.b_id = b_id;
    this.c_id = c_id;
    this.v_id = v_id;
    this.customerName = customerName;
    this.venueName = venueName;
    // let formatDate = new Date(date);
    // formatDate = formatDate.toLocaleString('en-US', { timeZone: 'UTC' })
    this.date = date;
    // this.date = formatDate.toDateString();
}

function displayBooking(booking) {
    let bookingDiv = document.createElement("div");
    bookingDiv.setAttribute("class", "individualBooking");
    document.getElementById("bookings").appendChild(bookingDiv);

    let customerName = document.createElement("textarea");
    customerName.setAttribute("class", "bookingText");
    customerName.setAttribute("cols", 30);
    customerName.readOnly = true;
    customerName.innerHTML = booking.customerName;
    bookingDiv.appendChild(customerName);

    let venueName = document.createElement("textarea");
    venueName.setAttribute("class", "bookingText");
    venueName.setAttribute("cols", 30);
    venueName.readOnly = true;
    venueName.innerHTML = booking.venueName;
    bookingDiv.appendChild(venueName);

    let bookingDate = document.createElement("textarea");
    bookingDate.setAttribute("class", "bookingText");
    bookingDate.setAttribute("cols", 30);
    bookingDate.readOnly = true;
    bookingDate.innerHTML = booking.date;
    bookingDiv.appendChild(bookingDate);

    let buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("id", "buttons");
    bookingDiv.appendChild(buttonsDiv);

    let deleteButton = new Button("Delete", "red");
    deleteButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(deleteButton.btn);
    deleteButton.btn.onclick = function() {
        deleteFunction(booking, bookingDiv);
    }
}

function deleteFunction(booking, bookingDiv) {
    let body = {apikey: apikey, b_id: booking.b_id};
    console.log(body);
    body = JSON.stringify(body);
    xhttp.open("DELETE", endPointRoot + "bookings/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            bookingDiv.remove();
        }
    }
}

function displayBookings() {
    xhttp.open("GET", endPointRoot + "bookings/" + apikey, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText);
        if (this.status == 400) {
            document.getElementById("loading").innerHTML = this.responseText;
        }else if (this.readyState == 4 && this.status == 200) {
            if (this.responseText) {
                let rows = JSON.parse(this.responseText);
                if (rows.length == 0) {
                    document.getElementById("loading").innerHTML = "No bookings stored in database.";
                } else {
                    document.getElementById("loading").style.display = "none";
                    for (let i = 0; i < rows.length; i++) {
                        console.log(rows[i]);
                        booking = new Booking(rows[i].b_id, rows[i].c_id, rows[i].venue_id, rows[i].fname + " " + rows[i].lname + " " + rows[i].email, rows[i].venue_name + " " + rows[i].address, rows[i].booking_date);
                        displayBooking(booking);
                    }
                }
            }
        }
    }
}

function addBooking() {

    let addingDiv = document.createElement("div");
    addingDiv.setAttribute("class", "individualBooking");
    document.getElementById("bookings").appendChild(addingDiv);

    let customerMenu = document.createElement("select");
    customerMenu.setAttribute("class", "dropdown");
    addingDiv.appendChild(customerMenu);
    populateCustomers(customerMenu);

    let venueMenu = document.createElement("select");
    venueMenu.setAttribute("class", "dropdown");
    addingDiv.appendChild(venueMenu);
    populateVenues(venueMenu);

    let datePicker = document.createElement("input");
    datePicker.setAttribute("type", "date");
    addingDiv.appendChild(datePicker);

    let buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("id", "buttons");
    addingDiv.appendChild(buttonsDiv);

    let saveButton = new Button("Save", "lightgreen");
    saveButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(saveButton.btn);
    saveButton.btn.onclick = function() {
        let selections = addingDiv.getElementsByClassName("dropdown");
        let customer = selections[0].value;
        let venue = selections[1].value;
        // If date is selected:
        if (datePicker.value != "") {
            saveFunction(customer, venue, datePicker.value, addingDiv);
        } else {
            window.alert(incompleteBooking);
        }
    }
    
}

function populateCustomers(menu) {
    let customers = [];
    let customerRequest = new XMLHttpRequest();
    customerRequest.open("GET", endPointRoot + "customers/" + apikey, true);
    customerRequest.send();
    customerRequest.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText) {
                let rows = JSON.parse(this.responseText);
                for (let i = 0; i < rows.length; i++) {
                    console.log(rows[i]);
                    customers.push(new Customer(rows[i].c_id, rows[i].fname, rows[i].lname, rows[i].email));
                }
                for (j = 0; j < customers.length; j++) {
                    let option = document.createElement("option");
                    option.innerHTML = `Name: ${customers[j].fname} ${customers[j].lname}, Email: ${customers[j].email}`
                    option.value = customers[j].id;
                    menu.appendChild(option);
                }
            }
        }
    }
}

function populateVenues(menu) {
    let venues = [];
    xhttp.open("GET", endPointRoot + "venues/" + apikey, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if (this.responseText) {
                let rows = JSON.parse(this.responseText);
                for (let i = 0; i < rows.length; i++) {
                    console.log(rows[i]);
                    venues.push(new Venue(rows[i].venue_id, rows[i].venue_name, rows[i].address));
                }
                for (j = 0; j < venues.length; j++) {
                    let option = document.createElement("option");
                    option.innerHTML = `Name: ${venues[j].name}, Address: ${venues[j].address}`
                    option.value = venues[j].id;
                    menu.appendChild(option);
                }
            }
        }
    }
}

function saveFunction(customer, venue, date, addingDiv) {
    let body = {apikey: apikey, v_id: venue, c_id: customer, date: date};
    body = JSON.stringify(body);
    console.log(body);
    xhttp.open("POST", endPointRoot + "bookings/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 401 || this.status == 400)) {
            window.alert(duplicateBooking);
        } else if (this.readyState == 4 && this.status == 200) {
            addingDiv.remove();
            console.log(JSON.parse(this.responseText));
            swapNewBookingToText(JSON.parse(this.responseText).insertId);
        };
    }
};

function swapNewBookingToText(booking_id) {
    bookinghttp = new XMLHttpRequest();
    bookinghttp.open("GET", endPointRoot + "bookings/booking/" + booking_id + "/" + apikey)
    bookinghttp.send();
    bookinghttp.onreadystatechange = function() {
        console.log(this.responseText)
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
            let row = JSON.parse(this.responseText)
            booking = new Booking(row[0].b_id, row[0].c_id, row[0].venue_id, row[0].fname + " " + row[0].lname + " " + row[0].email, row[0].venue_name + " " + row[0].address, row[0].booking_date);
            displayBooking(booking);
        }
    }
}

function addNewBooking() {
    document.getElementById("loading").style.display = "none";
    addBooking();
}

function back() {
    window.location.href = "index.html";
}

displayBookings();
let addBookingButton = new Button("Add", "lightgreen");
document.body.appendChild(addBookingButton.btn);
addBookingButton.btn.onclick = addNewBooking;

document.body.appendChild(document.createElement("br"));
let backButton = new Button("Back", "grey");
backButton.btn.style.marginTop = "0.5em";
document.body.appendChild(backButton.btn);
backButton.btn.onclick = back;