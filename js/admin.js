const endPointRoot = "https://henryliu-cst.com/COMP_4537/term_project/API/v1/";
const xhttp = new XMLHttpRequest();

function Button(name, colour) {
    this.btn = document.createElement("button");
    this.btn.innerHTML = name;
    this.btn.style.backgroundColor = colour;
}

function displayStats() {
    xhttp.open("GET", endPointRoot + "statistics/", true);
    xhttp.send();
    xhttp.onreadystatechange = function() {
        console.log(this.responseText);
        if (this.readyState == 4 && this.status == 200) {
            let stats_table = document.getElementById("stats_table");
            let rows = JSON.parse(this.responseText);
            document.getElementById("loading").style.display = "none";
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
    }
}


function back() {
    window.location.href = "index.html";
}

displayStats();
document.body.appendChild(document.createElement("br"));
let backButton = document.createElement("button");
backButton.innerHTML = "Back";
backButton.style.backgroundColor = "grey"
backButton.style.marginTop = "0.5em";
document.body.appendChild(backButton);
backButton.onclick = back;