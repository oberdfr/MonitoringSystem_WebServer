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

function updateCurrentCo2() {
    fetch('/latestco2')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            co2.innerHTML = data.MQ7 + " ppm";
        })
        .catch(error => console.error('Error fetching bin data:', error));
}

function updateCurrentAirQuality() {
    fetch('/latestairquality')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            qualita.innerHTML = data.MQ2 + " ppm";
        })
        .catch(error => console.error('Error fetching bin data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    updateCurrentAirQuality()
    updateCurrentCo2()
    setInterval(updateCurrentAirQuality, 1 * 1000); // Update every 5 minutes
    setInterval(updateCurrentCo2, 1 * 1000); // Update every 5 minutes
});
