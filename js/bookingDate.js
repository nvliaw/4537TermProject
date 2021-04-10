const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();
const duplicateBooking = "Please select a date first."
const noBookings = "No bookings have been made."
const apikey = "MyAppKey";
let allBookings = [];


function Booking(customerName, venueName, date) {
    this.customerName = customerName;
    this.venueName = venueName;
    this.date = date;
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
}


function getAllBookings() {
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
                    document.getElementById("loading").innerHTML = noBookings;
                } else {
                    document.getElementById("loading").style.display = "none";
                    for (let i = 0; i < rows.length; i++) {
                        console.log(rows[i]);
                        booking = new Booking(rows[i].fname + " " + rows[i].lname + " " + rows[i].email, rows[i].venue_name + " " + rows[i].address, rows[i].booking_date);
                        allBookings.push(booking);
                    }
                }
            }
        }
    }
}

function populateBookings() {
    let date = document.getElementById("datepicker").value;
    let totalBookings = 0;
    document.getElementById("bookings").innerHTML = '';

    for (let i = 0; i < allBookings.length; i++) {
        if (allBookings[i].date == date) {
            displayBooking(allBookings[i]);
            totalBookings++;
        }
    }
    let totalBookingText = document.createElement("p");
    document.getElementById("bookings").appendChild(totalBookingText);
    totalBookingText.style.color = "white";
    totalBookingText.innerHTML = `Total Bookings for ${date}: ${totalBookings}`;

    
}

getAllBookings();
document.getElementById("datepicker").onchange = populateBookings;

function back() {
    window.location.href = "index.html";
}

document.body.appendChild(document.createElement("br"));
let backButton = document.createElement("button");
backButton.innerHTML = "Back";
backButton.style.marginTop = "0.5em";
document.body.appendChild(backButton);
backButton.onclick = back;