const username = document.getElementById('user');
const pwd = document.getElementById('pwd');
const btn = document.getElementById('btn');

function getPwd() {
    return pwd.value;
}

function getUser() {
    return username.value;
}

function posso() {
    let pwd = getPwd();
    let user = getUser();
    let string = "http://192.168.100.104:5000/posso?user=" + user + "&pwd=" + pwd;

    fetch(string, { credentials: 'include' })  // Include credentials in the request
        .then(response => {
            if (response.redirected) {
                // Handle manual redirection
                window.location.href = response.url;
            } else {
                return response.json();
            }
        })
        .then(data => {
            if (data.status === "success") {
                window.location.href = data.path;
            } else {
                console.log("Invalid credentials");
            }
        })
        .catch(error => console.log("Si è verificato un errore!", error));
}

function checkSession() {
    fetch("http://192.168.100.104:5000/check_session", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            if (data.status === "authenticated") {
                window.location.href = "http://192.168.100.104:5000/dashboard.html";
            }
        })
        .catch(error => console.log("Error checking session:", error));
}

document.addEventListener('DOMContentLoaded', checkSession);
btn.addEventListener('click', posso);