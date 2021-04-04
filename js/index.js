const adminPage = "admin.html";
const customerPage = "customer.html";
const venuePage = "venue.html";
const bookingPage = "booking.html";

function Button(name, colour) {
    this.btn = document.createElement("button");
    document.body.appendChild(this.btn);
    this.btn.innerHTML = name;
    this.btn.style.backgroundColor = colour;
}

function goToPage(url) {
    return function() {
        window.location.href = url;
    }
}

function displayTitle(pageTitle) {
    let title = document.createElement("h1");
    document.body.appendChild(title);
    title.innerHTML = pageTitle;
}

displayTitle("Term Project - Vegas Wedding Venues");

let adminButton = new Button("Admin Page", "red");
adminButton.btn.style.margin = "0.5em";
adminButton.btn.onclick = goToPage(adminPage);

let customerButton = new Button("Customers Page", "lightgreen");
customerButton.btn.style.margin = "0.5em";
customerButton.btn.onclick = goToPage(customerPage);

let venueButton = new Button("Venues Page", "lightgreen");
venueButton.btn.style.margin = "0.5em";
venueButton.btn.onclick = goToPage(venuePage);

let bookingButton = new Button("Bookings Page", "lightgreen");
bookingButton.btn.style.margin = "0.5em";
bookingButton.btn.onclick = goToPage(bookingPage);