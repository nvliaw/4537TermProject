const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();
const incompleteCustomer = "Please ensure customer details are filled out completely."
const duplicateCustomerEmail = "Email is already used. Please enter a different email."
const missingCustomerEmail = "Email does not exist. Please ensure the email is correct."
const incorrectEmail = "Please enter a valid email."
const existingBooking = "Unable to delete customer. Customer is used in a booking."
const apikey = "MyAppKey";

function Button(name, colour) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = name;
    this.btn.style.backgroundColor = colour;
}

function Customer(fname, lname, email) {
    this.fname = fname;
    this.lname = lname;
    this.email = email;
}

function displayCustomer(customer = null) {
    let customerDiv = document.createElement("div");
    customerDiv.setAttribute("class", "individualCustomer");
    document.getElementById("customers").appendChild(customerDiv);

    let customerfname = document.createElement("textarea");
    customerfname.setAttribute("class", "customerText");
    customerfname.setAttribute("cols", 25);
    customerfname.placeholder = "Customer First Name"
    customerDiv.appendChild(customerfname);

    let customerlname = document.createElement("textarea");
    customerlname.setAttribute("class", "customerText");
    customerlname.setAttribute("cols", 25);
    customerlname.placeholder = "Customer Last Name"
    customerDiv.appendChild(customerlname);

    let customeremail = document.createElement("textarea");
    customeremail.setAttribute("class", "customerText");
    customeremail.setAttribute("cols", 30);
    customeremail.placeholder = "Customer Email"
    customerDiv.appendChild(customeremail);

    let buttonsDiv = document.createElement("div");
    buttonsDiv.setAttribute("id", "buttons");
    customerDiv.appendChild(buttonsDiv);

    let updateButton = new Button("Update", "powderblue");
    updateButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(updateButton.btn);
    updateButton.btn.onclick = function() {
        let customerTexts = customerDiv.getElementsByClassName("customerText");
        let newfname = customerTexts[0].value;
        let newlname = customerTexts[1].value;
        let newemail = customerTexts[2].value;
        if (newfname.trim() && newlname.trim() && newemail.trim()) {
            let newcustomer = new Customer(newfname, newlname, newemail)
            let body = {apikey: apikey, oldEmail: customer.email, newFname: newcustomer.fname, newLname: newcustomer.lname, newEmail: newcustomer.email};
            body = JSON.stringify(body);
            xhttp.open("PUT", endPointRoot + "customers/", true);
            xhttp.setRequestHeader('Content-type', 'application/json')
            xhttp.send(body);
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    customer = newcustomer;
                } else if (this.readyState == 4 && this.status == 401) {
                    window.alert(duplicateCustomerEmail);
                } else if (this.readyState == 4 && this.status == 402) {
                    window.alert(missingCustomerEmail);
                }
            }
        } else {
            window.alert(incompleteCustomer);
        }
    }

    let deleteButton = new Button("Delete", "red");
    deleteButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(deleteButton.btn);
    deleteButton.btn.onclick = function() {
        deleteFunction(customer, customerDiv);
    }

    let saveButton = new Button("Save", "lightgreen");
    saveButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(saveButton.btn);
    saveButton.btn.onclick = function() {
        let customerTexts = customerDiv.getElementsByClassName("customerText");
        let newfname = customerTexts[0].value;
        let newlname = customerTexts[1].value;
        let newemail = customerTexts[2].value;
        if (newemail.includes("@") && newemail.includes(".")) {
            if (newfname.trim() && newlname.trim()) {
                customer = new Customer(newfname, newlname, newemail);
                saveFunction(customer, saveButton, deleteButton, updateButton);
            } else {
                window.alert(incompleteCustomer);
            }
        } else {
            window.alert(incorrectEmail);
        }
    }

    if (customer) {
        customerfname.innerHTML = customer.fname;
        customerlname.innerHTML = customer.lname;
        customeremail.innerHTML = customer.email;
        saveButton.btn.style.display = "none";
    } else {
        deleteButton.btn.style.display = "none";
        updateButton.btn.style.display = "none";
    }
}

function saveFunction(customer, saveButton, deleteButton, updateButton) {
    let body = {apikey: apikey, fname: customer.fname, lname: customer.lname, email: customer.email};
    body = JSON.stringify(body);
    xhttp.open("POST", endPointRoot + "customers/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && (this.status == 401 || this.status == 400)) {
            window.alert(duplicateCustomerEmail);
        } else if (this.readyState == 4 && this.status == 200) {
            saveButton.btn.style.display = "none";
            deleteButton.btn.style.display = "";
            updateButton.btn.style.display = "";
        };
    }
};


function deleteFunction(customer, customerDiv) {
    let body = {apikey: apikey, email: customer.email};
    body = JSON.stringify(body);
    xhttp.open("DELETE", endPointRoot + "customers/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 402) {
            window.alert(missingCustomerEmail);
        } else if (this.readyState == 4 && this.status == 200) {
            customerDiv.remove();
        } else if (this.readyState == 4 && this.status == 406) {
            window.alert(existingBooking);
        }
    }
}

function displayCustomers() {
    xhttp.open("GET", endPointRoot + "customers/" + apikey, true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        if (this.status == 400) {
            document.getElementById("loading").innerHTML = this.responseText;
        }else if (this.readyState == 4 && this.status == 200) {
            if (this.responseText) {
                let rows = JSON.parse(this.responseText);
                if (rows.length == 0) {
                    document.getElementById("loading").innerHTML = "No customers stored in database.";
                } else {
                    document.getElementById("loading").style.display = "none";
                    for (let i = 0; i < rows.length; i++) {
                        customer = new Customer(rows[i].fname, rows[i].lname, rows[i].email);
                        displayCustomer(customer);
                    }
                }
            }
        }
    }
}

function addNewCustomer() {
    document.getElementById("loading").style.display = "none";
    displayCustomer();
}

function back() {
    window.location.href = "index.html";
}

displayCustomers();
let addCustomerButton = new Button("Add", "lightgreen");
document.body.appendChild(addCustomerButton.btn);
addCustomerButton.btn.onclick = addNewCustomer;

document.body.appendChild(document.createElement("br"));
let backButton = new Button("Back", "grey");
backButton.btn.style.marginTop = "0.5em";
document.body.appendChild(backButton.btn);
backButton.btn.onclick = back;