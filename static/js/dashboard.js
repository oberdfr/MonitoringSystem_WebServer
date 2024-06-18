
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let logoutBtn = document.querySelector("#logout-button");
let homeSection = document.querySelector("#dashHomeSection");
let firstRowDashboard = document.querySelector("#firstRowDashboard");
let secondRowDashboard = document.querySelector("#secondRowDashboard");
let paperChartResult = document.getElementById("paperChartResult");
let plasticChartResult = document.getElementById("plasticChartResult");
let paperContainerMobile = document.getElementById("paperContainerMobile");
let plasticContainerMobile = document.getElementById("plasticContainerMobile");
let mobileBinsContainer = document.querySelector("#mobileBinsContainer");
let qPP = document.getElementById('qualityPrimoPiano');
let qS = document.getElementById('qualitySeminterrato');
let qPPChip = document.getElementById('qualityPrimoPianoChip');
let qSChip = document.getElementById('qualitySeminterratoChip');

const COLOR_BAD = "#ef8b8b"
const COLOR_WARNING = "#efd18b"
const COLOR_GOOD = "#87bdf0"

function isMobileDevice() {
    console.log(/Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent));
    return /Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent);
}

let globeResult = document.createElement('div');
globeResult.id = 'globeResult';
globeResult.className = 'result_black col';
globeResult.style.height = '500px';
globeResult.style.width = '600px';
globeResult.style.marginTop = '0px';
globeResult.style.marginBottom = '0px';
globeResult.innerHTML = `
            <div class="globeContainer" id="globe-container" style="height: 480px; width: 97.5%;"></div>
        `;

const DESKTOP_BIG = 1;
const DESKTOP_LITTLE = 2;
const MOBILE = 3;

var windowWidth = window.innerWidth;
var webWiew = 4;

function updateWindowWidth() {
    firstRowDashboard = document.querySelector("#firstRowDashboard");
    secondRowDashboard = document.querySelector("#secondRowDashboard");
    paperChartResult = document.querySelector("#paperChartResult");
    plasticChartResult = document.querySelector("#plasticChartResult");
    windowWidth = window.innerWidth;

    if ((isMobileDevice() || windowWidth <= 1000) && webWiew != MOBILE) {
        if (!isMobileDevice()) {
            globeResult.style.width = '97.5%';
            firstRowDashboard.appendChild(globeResult);
        }
        paperContainerMobile.appendChild(paperChartResult);
        plasticContainerMobile.appendChild(plasticChartResult);
        webWiew = MOBILE;
    }

    if (windowWidth <= 1550 && windowWidth > 1000 && webWiew != DESKTOP_LITTLE) {
        if (!firstRowDashboard.contains(globeResult)) {
            firstRowDashboard.appendChild(globeResult);
        }
        if (!isMobileDevice()) {
            globeResult.style.width = '97.5%';
            firstRowDashboard.appendChild(globeResult);
        }
        secondRowDashboard.appendChild(paperChartResult);
        secondRowDashboard.appendChild(plasticChartResult);
        webWiew = DESKTOP_LITTLE;
    }

    if (windowWidth > 1550 && webWiew != DESKTOP_BIG) {
        if (!firstRowDashboard.contains(globeResult)) {
            firstRowDashboard.appendChild(globeResult);
        }
        if (!isMobileDevice()) {
            globeResult.style.width = '580px';
            firstRowDashboard.appendChild(globeResult);
        }
        firstRowDashboard.appendChild(paperChartResult);
        firstRowDashboard.appendChild(plasticChartResult);
        webWiew = DESKTOP_BIG;
    }
}

document.addEventListener('DOMContentLoaded', updateWindowWidth);
window.addEventListener('resize', updateWindowWidth);

logoutBtn.addEventListener("click", () => {
    console.log("Logout clicked");
    logout();
    setTimeout(function () {
        window.location.reload()
    }, 2500);

});

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
    fetch("http://192.168.11.29:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}

function setFullHeight() {
    const section = document.getElementById('dashHomeSection');
    section.style.height = `${document.documentElement.scrollHeight}px`;
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('DOMContentLoaded', setFullHeight);

function fillCircle(type, percentage) {
    const circle = document.getElementById(`circle${type.charAt(0).toUpperCase() + type.slice(1)}`);
    const text = circle.nextElementSibling;
    const radius = 12.9155;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = `${circumference}`;

    setTimeout(() => {
        //console.log(circle.style.strokeDashoffset);
        //console.log(`${offset}`);
        //console.log(text.textContent);
        //console.log(`${percentage}%`);
        //if (text.textContent != `${percentage}%`) {
        circle.style.strokeDashoffset = `${offset}`;
        text.textContent = `${percentage}%`;
        //}

    }, 10);
}

function updateBinData() {
    fetch('/latestbins')
        .then(response => response.json())
        .then(data => {
            fillCircle('carta', data.carta);
            fillCircle('plastica', data.plastica);
        })
        .catch(error => console.error('Error fetching bin data:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    updateBinData();
    setInterval(updateBinData, 1 * 5000); // Update every 5 seconds
});

async function getCurrentCo2S() {
    try {
        let response = await fetch('/latestco2s');
        let data = await response.json();
        console.log(data);
        return data.MQ7;
    } catch (error) {
        console.error('Error fetching CO2 data for Seminterrato:', error);
        return null; // Return null if there's an error
    }
}

async function getCurrentCo2PP() {
    try {
        let response = await fetch('/latestco2pp');
        let data = await response.json();
        console.log(data);
        return data.MQ7;
    } catch (error) {
        console.error('Error fetching CO2 data for Primo Piano:', error);
        return null; // Return null if there's an error
    }
}

async function getCurrentAirQualityS() {
    try {
        let response = await fetch('/latestairqualitys');
        let data = await response.json();
        console.log(data);
        return data.MQ2;
    } catch (error) {
        console.error('Error fetching air quality data for Seminterrato:', error);
        return null; // Return null if there's an error
    }
}

async function getCurrentAirQualityPP() {
    try {
        let response = await fetch('/latestairqualitypp');
        let data = await response.json();
        console.log(data);
        return data.MQ2;
    } catch (error) {
        console.error('Error fetching air quality data for Primo Piano:', error);
        return null; // Return null if there's an error
    }
}

async function updateSummary() {
    let co2Seminterrato = await getCurrentCo2S();
    let qualitaSeminterrato = await getCurrentAirQualityS();
    let co2PrimoPiano = await getCurrentCo2PP();
    let qualitaPrimoPiano = await getCurrentAirQualityPP();

    function calculateQuality(co2, qualita) {
        if (co2 < 550 && qualita < 500) {
            return "GOOD";
        } else if ((co2 >= 550 && co2 < 900) || (qualita >= 500 && qualita < 700)) {
            return "MEDIOCRE";
        } else {
            return "BAD";
        }
    }

    function determineColor(co2, qualita) {
        if (co2 < 550 && qualita < 500) {
            return COLOR_GOOD;
        } else if ((co2 >= 550 && co2 < 900) || (qualita >= 500 && qualita < 700)) {
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
    setInterval(updateSummary, 2.5 * 1000); // Update every 2.5 seconds
});