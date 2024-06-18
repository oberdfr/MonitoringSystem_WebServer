
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

function isMobileDevice() {
    console.log(/Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent));
    return /Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent);
}

let globeResult = document.createElement('div');
globeResult.id = 'globeResult';
globeResult.className = 'result_black col';
globeResult.style.height = '500px';
globeResult.style.width = 'calc(100% + 5px)';
globeResult.style.marginTop = '0px';
globeResult.style.marginBottom = '0px';
globeResult.innerHTML = `
            <div class="globeContainer" id="globe-container" style="height: 480px; width: 580px;"></div>
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
    fetch("http://192.168.100.105:5000/logout", { credentials: 'include' })
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