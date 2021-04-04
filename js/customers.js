const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();
const incompleteCustomer = "Please ensure customer details are filled out completely."

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
    console.log(customer);
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
            updateFunction(customer, newcustomer);
            customer = newcustomer;
        } else {
            window.alert(incompleteCustomer);
        }
    }

    let deleteButton = new Button("Delete", "red");
    deleteButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(deleteButton.btn);
    deleteButton.btn.onclick = function() {
        deleteFunction(customer);
        customerDiv.remove();
    }

    let saveButton = new Button("Save", "lightgreen");
    saveButton.btn.setAttribute("class", "functionButton");
    buttonsDiv.appendChild(saveButton.btn);
    saveButton.btn.onclick = function() {
        let customerTexts = customerDiv.getElementsByClassName("customerText");
        let newfname = customerTexts[0].value;
        let newlname = customerTexts[1].value;
        let newemail = customerTexts[2].value;
        if (newfname.trim() && newlname.trim() && newemail.trim()) {
            newcustomer = new Customer(newfname, newlname, newemail);
            saveFunction(newcustomer);
            saveButton.btn.style.display = "none";
            deleteButton.btn.style.display = "";
            updateButton.btn.style.display = "";
            customer = newcustomer;
        } else {
            window.alert(incompleteCustomer);
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

function saveFunction(customer) {
    let body = JSON.stringify(customer);
    console.log(body);
    xhttp.open("POST", endPointRoot + "customers/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
}

function deleteFunction(customer) {
    let body = JSON.stringify(customer);
    xhttp.open("DELETE", endPointRoot + "customers/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
}

function updateFunction(oldcustomer, newcustomer) {
    let body = {oldFname: oldcustomer.fname, oldLname: oldcustomer.lname, oldEmail: oldcustomer.email, newFname: newcustomer.fname, newLname: newcustomer.lname, newEmail: newcustomer.email};
    body = JSON.stringify(body);
    console.log(body);
    xhttp.open("PUT", endPointRoot + "customers/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            console.log(this.responseText);
        }
    }
}

function displayCustomers() {
    xhttp.open("GET", endPointRoot + "customers/", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
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