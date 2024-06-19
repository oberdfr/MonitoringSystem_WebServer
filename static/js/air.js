var co2_s = document.getElementById('co2_s');
var co2_pp = document.getElementById('co2_pp');
var temp = document.getElementById('temp');
var qualita_s = document.getElementById('qualita_s');
var qualita_pp = document.getElementById('qualita_pp');
var piove = document.getElementById('piove');
let primoPianoContainer = document.getElementById('primoPianoContainer');
let seminterratoContainer = document.getElementById('seminterratoContainer');
let airRow1 = document.getElementById('airRow1');
let airRow2 = document.getElementById('airRow2');
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let logoutBtn = document.querySelector("#logout-button");
let qPP = document.getElementById('qualityPrimoPiano');
let qS = document.getElementById('qualitySeminterrato');
let qPPChip = document.getElementById('qualityPrimoPianoChip');
let qSChip = document.getElementById('qualitySeminterratoChip');

const COLOR_BAD = "#ef8b8b"
const COLOR_WARNING = "#efd18b"
const COLOR_GOOD = "#87bdf0"

closeBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();
});

searchBtn.addEventListener("click", () => {
    sidebar.classList.toggle("open");
    menuBtnChange();
});

function menuBtnChange() {
    if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
    } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
    }
}

function logout() {
    fetch("http://192.168.11.202:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}

logoutBtn.addEventListener("click", () => {
    console.log("Logout clicked");
    logout();
    setTimeout(function () {
        window.location.reload();
    }, 2500);
});

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

function updateCurrentCo2() {
    fetch('/latestco2s')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            co2_s.innerHTML = data.MQ7 + " ppm";
        })
        .catch(error => console.error('Error fetching bin data:', error));

    fetch('/latestco2pp')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            co2_pp.innerHTML = data.MQ7 + " ppm";
        })
        .catch(error => console.error('Error fetching bin data:', error));
}

function updateCurrentAirQuality() {
    fetch('/latestairqualitys')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            qualita_s.innerHTML = data.MQ2 + " ppm";
        })
        .catch(error => console.error('Error fetching bin data:', error));

    fetch('/latestairqualitypp')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            qualita_pp.innerHTML = data.MQ2 + " ppm";
        })
        .catch(error => console.error('Error fetching bin data:', error));
}

function updateSummary() {
    let co2Seminterrato = parseFloat(co2_s.innerHTML);
    let qualitaSeminterrato = parseFloat(qualita_s.innerHTML);
    let co2PrimoPiano = parseFloat(co2_pp.innerHTML);
    let qualitaPrimoPiano = parseFloat(qualita_pp.innerHTML);

    function calculateQuality(co2, qualita) {
        if (co2 < 650 && qualita < 650) {
            return "GOOD";
        } else if ((co2 >= 650 && co2 < 900) || (qualita >= 650 && qualita < 750)) {
            return "MEDIOCRE";
        } else {
            return "BAD";
        }
    }

    function determineColor(co2, qualita) {
        if (co2 < 650 && qualita < 650) {
            return COLOR_GOOD;
        } else if ((co2 >= 650 && co2 < 900) || (qualita >= 650 && qualita < 750)) {
            return COLOR_WARNING;
        } else {
            return COLOR_BAD;
        }
    }

    qS.innerHTML = calculateQuality(co2Seminterrato, qualitaSeminterrato);
    qPP.innerHTML = calculateQuality(co2PrimoPiano, qualitaPrimoPiano);
    qSChip.style.backgroundColor = determineColor(co2Seminterrato, qualitaSeminterrato);
    qPPChip.style.backgroundColor = determineColor(co2PrimoPiano, qualitaPrimoPiano);
}

document.addEventListener('DOMContentLoaded', function () {
    updateCurrentAirQuality();
    updateCurrentCo2();
    setInterval(updateCurrentAirQuality, 5 * 1000); // Update every 5 seconds
    setInterval(updateCurrentCo2, 5 * 1000); // Update every 5 seconds
    setInterval(updateSummary, 2.5 * 1000); // Update every 5 seconds
});

function setFullHeight() {
    const section = document.getElementById('airHomeSection');
    section.style.height = `${document.documentElement.scrollHeight}px`;
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('DOMContentLoaded', setFullHeight);
