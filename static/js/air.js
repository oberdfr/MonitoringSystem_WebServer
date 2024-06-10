var co2 = document.getElementById('co2')
var temp = document.getElementById('temp')
var qualita = document.getElementById('qualita')
var piove = document.getElementById('piove')

function logout() {
    fetch("http://192.168.100.106:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}

