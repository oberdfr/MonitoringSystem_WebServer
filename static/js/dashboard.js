
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let logoutBtn = document.querySelector("#logout-button");
let firstRowDashboard = document.querySelector("#firstRowDashboard");
let secondRowDashboard = document.querySelector("#secondRowDashboard");
let paperChartResult = document.querySelector("#paperChartResult");
let plasticChartResult = document.querySelector("#plasticChartResult");

var windowWidth = window.innerWidth;
if (windowWidth <= 1500) {
    var mobileWiew = true;
} else if (windowWidth > 1500) {
    var mobileWiew = false;
}

function updateWindowWidth() {
    firstRowDashboard = document.querySelector("#firstRowDashboard");
    secondRowDashboard = document.querySelector("#secondRowDashboard");
    paperChartResult = document.querySelector("#paperChartResult");
    plasticChartResult = document.querySelector("#plasticChartResult");
    windowWidth = window.innerWidth;

    if (windowWidth <= 1550 && !mobileWiew) {
        secondRowDashboard.appendChild(paperChartResult);
        secondRowDashboard.appendChild(plasticChartResult);
        mobileWiew = true;
    }

    if (windowWidth > 1550 && mobileWiew) {
        firstRowDashboard.appendChild(paperChartResult);
        firstRowDashboard.appendChild(plasticChartResult);
        mobileWiew = false;
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
    fetch("http://192.168.1.5:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}
