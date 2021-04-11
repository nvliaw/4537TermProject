const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();
const incompleteVenue = "Please ensure venue details are filled out completely."
const duplicateVenueName = "Venue name is already used. Please enter a different name."
const missingVenueName = "Venue name does not exist. Please ensure the name is correct."
const existingBooking = "Unable to delete venue. Venue is used in a booking."
const apikey = "MyAppKey";

function Button(name, colour) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = name;
    this.btn.style.backgroundColor = colour;
}

function Venue(name, address) {
    this.name = name;
    this.address = address;
}

function displayVenue(venue = null) {
    let venueDiv = document.createElement("div");
    venueDiv.setAttribute("class", "individualVenue");
    document.getElementById("venues").appendChild(venueDiv);

    let venueName = document.createElement("textarea");
    venueName.setAttribute("class", "venueText");
    venueName.setAttribute("cols", 30);
    venueName.placeholder = "Venue Name"
    venueDiv.appendChild(venueName);

    let venueAddress = document.createElement("textarea");
    venueAddress.setAttribute("class", "venueText");
    venueAddress.setAttribute("cols", 35);
    venueAddress.placeholder = "Venue Address"
    venueDiv.appendChild(venueAddress);

    let buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("id", "buttons");
    venueDiv.appendChild(buttonsDiv);

    let updateButton = new Button("Update", "powderblue");
    updateButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(updateButton.btn);
    updateButton.btn.onclick = function() {
        let venueTexts = venueDiv.getElementsByClassName("venueText");
        let newname = venueTexts[0].value;
        let newaddress = venueTexts[1].value;
        if (newname.trim() && newaddress.trim()) {
            let newvenue = new Venue(newname, newaddress);
            let body = {apikey: apikey, oldName: venue.name, newName: newvenue.name, newAddress: newvenue.address};
            body = JSON.stringify(body);
            xhttp.open("PUT", endPointRoot + "venues/", true);
            xhttp.setRequestHeader('Content-type', 'application/json')
            xhttp.send(body);
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    venue = newvenue;
                } else if (this.readyState == 4 && this.status == 401) {
                    window.alert(duplicateVenueName);
                } else if (this.readyState == 4 && this.status == 402) {
                    window.alert(missingVenueName);
                }
            }
        } else {
            window.alert(incompleteVenue);
        }
    }

    let deleteButton = new Button("Delete", "red");
    deleteButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(deleteButton.btn);
    deleteButton.btn.onclick = function() {
        deleteFunction(venue, venueDiv);
    }

    let saveButton = new Button("Save", "lightgreen");
    saveButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(saveButton.btn);
    saveButton.btn.onclick = function() {
        let venueTexts = venueDiv.getElementsByClassName("venueText");
        let newname = venueTexts[0].value;
        let newaddress = venueTexts[1].value;
        if (newname.trim() && newaddress.trim()) {
            venue = new Venue(newname, newaddress);
            saveFunction(venue, saveButton, deleteButton, updateButton);
        } else {
            window.alert(incompleteVenue);
        }
    }

    if (venue) {
        venueName.innerHTML = venue.name;
        venueAddress.innerHTML = venue.address;
        saveButton.btn.style.display = "none";
    } else {
        deleteButton.btn.style.display = "none";
        updateButton.btn.style.display = "none";
    }
}

function saveFunction(venue, saveButton, deleteButton, updateButton) {
    let body = {apikey: apikey, name: venue.name, address: venue.address};
    body = JSON.stringify(body);
    xhttp.open("POST", endPointRoot + "venues/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 401 || this.status == 400)) {
            window.alert(duplicateVenueName);
        } else if (this.readyState == 4 && this.status == 200) {
            saveButton.btn.style.display = "none";
            deleteButton.btn.style.display = "";
            updateButton.btn.style.display = "";
        };
    }
};

function deleteFunction(venue, venueDiv) {
    let body = {apikey: apikey, name: venue.name};
    body = JSON.stringify(body);
    xhttp.open("DELETE", endPointRoot + "venues/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 402) {
            window.alert(missingVenueName);
        } else if (this.readyState == 4 && this.status == 200) {
            venueDiv.remove();
        } else if (this.readyState == 4 && this.status == 406) {
            window.alert(existingBooking)
        }
    }
}

function displayVenues() {
    xhttp.open("GET", endPointRoot + "venues/" + apikey, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.status == 400) {
            document.getElementById("loading").innerHTML = this.responseText;
        }else if (this.readyState == 4 && this.status == 200) {
            if (this.responseText) {
                let rows = JSON.parse(this.responseText);
                if (rows.length == 0) {
                    document.getElementById("loading").innerHTML = "No venues stored in database.";
                } else {
                    document.getElementById("loading").style.display = "none";
                    for (let i = 0; i < rows.length; i++) {
                        venue = new Venue(rows[i].venue_name, rows[i].address);
                        displayVenue(venue);
                    }
                }
            }
        }
    }
}

function addNewVenue() {
    document.getElementById("loading").style.display = "none";
    displayVenue();
}

function back() {
    window.location.href = "index.html";
}

displayVenues();
let addVenueButton = new Button("Add", "lightgreen");
document.body.appendChild(addVenueButton.btn);
addVenueButton.btn.onclick = addNewVenue;

document.body.appendChild(document.createElement("br"));
let backButton = new Button("Back", "grey");
backButton.btn.style.marginTop = "0.5em";
document.body.appendChild(backButton.btn);
backButton.btn.onclick = back;