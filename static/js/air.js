var co2 = document.getElementById('co2')
var temp = document.getElementById('temp')
var qualita = document.getElementById('qualita')
var piove = document.getElementById('piove')
let primoPianoContainer = document.getElementById('primoPianoContainer')
let seminterratoContainer = document.getElementById('seminterratoContainer')
let airRow1 = document.getElementById('airRow1')
let airRow2 = document.getElementById('airRow2')

function isMobileDevice() {
    console.log(/Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent));
    return /Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent);
}

const DESKTOP_BIG = 1;
const DESKTOP_LITTLE = 2;
const MOBILE = 3;

var windowWidth = window.innerWidth;
var webWiew = 4;

function updateWindowWidth() {

    windowWidth = window.innerWidth;

    if ((isMobileDevice() || windowWidth <= 1000) && webWiew != MOBILE) {
        if (isMobileDevice()) {

        }
        airRow2.appendChild(seminterratoContainer);
        webWiew = MOBILE;
    }

    if (windowWidth <= 1550 && windowWidth > 1000 && webWiew != DESKTOP_LITTLE) {
        airRow2.appendChild(seminterratoContainer);
        webWiew = DESKTOP_LITTLE;
    }

    if (windowWidth > 1550 && webWiew != DESKTOP_BIG) {
        airRow1.appendChild(seminterratoContainer);
        webWiew = DESKTOP_BIG;
    }
}

document.addEventListener('DOMContentLoaded', updateWindowWidth);
window.addEventListener('resize', updateWindowWidth);

function logout() {
    fetch("http://192.168.68.63:5000/logout", { credentials: 'include' })
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

function setFullHeight() {
    const section = document.getElementById('airHomeSection');
    section.style.height = `${document.documentElement.scrollHeight}px`;
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('DOMContentLoaded', setFullHeight);
