const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();
const incorrectCredentials = "Incorrect Credentials. Please try again."

function displayStats(rows) {
    let stats_table = document.getElementById("stats_table");
    stats_table.style.visibility = "visible";
    for (let i = 0; i < rows.length; i++) {
        let table_row = stats_table.insertRow();
        let method = table_row.insertCell(0);
        let endpoint = table_row.insertCell(1);
        let requests = table_row.insertCell(2);
        method.innerHTML = rows[i].method;
        endpoint.innerHTML = rows[i].endpoint;
        requests.innerHTML = rows[i].requests;
    }
}

function submit() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let body = {username: username, password: password};
    body = JSON.stringify(body);
    xhttp.open("POST", endPointRoot + "statistics/", true);
    xhttp.setRequestHeader('Content-type', 'application/json')
    xhttp.send(body);
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 405) {
            window.alert(incorrectCredentials);
        } else if (this.readyState == 4 && this.status == 200) {
            document.getElementById("credentials").style.display = "none";
            displayStats(JSON.parse(this.responseText));
        };
    }
}


function back() {
    window.location.href = "index.html";
}

document.getElementById("submit").onclick = submit;


document.body.appendChild(document.createElement("br"));
let backButton = document.createElement("button");
backButton.innerHTML = "Back";
backButton.style.backgroundColor = "grey"
backButton.style.marginTop = "0.5em";
document.body.appendChild(backButton);
backButton.onclick = back;