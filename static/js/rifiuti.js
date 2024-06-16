let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let logoutBtn = document.querySelector("#logout-button");
let weekChart = document.getElementById('weekChart');
let monthChart = document.getElementById('monthChart');
let yearChart = document.getElementById('yearChart');
let sidebysideContainer = document.getElementById('containerSide-by-side');
var chartContainer = document.getElementById('chartContainer')

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
    console.log('weekChart:', weekChart);
    console.log('monthChart:', monthChart);
    console.log('yearChart:', yearChart);

    windowWidth = window.innerWidth;

    if ((isMobileDevice() || windowWidth <= 1000) && webWiew != MOBILE) {
        weekChart.style.width = '80%';
        monthChart.style.width = '80%';
        yearChart.style.width = '80%';

        weekChart.style.float = 'none';
        yearChart.style.float = 'none';

        weekChart.style.marginBottom = '40px';
        monthChart.style.marginBottom = '40px';
        yearChart.style.marginBottom = '40px';
        chartContainer.appendChild(weekChart);
        chartContainer.appendChild(monthChart);
        chartContainer.appendChild(yearChart)
        webWiew = MOBILE;
    }

    if (windowWidth <= 1550 && windowWidth > 1000 && webWiew != DESKTOP_LITTLE) {
        weekChart.style.width = '70%';
        monthChart.style.width = '70%';
        yearChart.style.width = '70%';

        weekChart.style.float = 'none';
        yearChart.style.float = 'none';

        weekChart.style.marginBottom = '40px';
        monthChart.style.marginBottom = '40px';
        yearChart.style.marginBottom = '40px';

        chartContainer.appendChild(weekChart);
        chartContainer.appendChild(monthChart);
        chartContainer.appendChild(yearChart)
        webWiew = DESKTOP_LITTLE;
    }

    if (windowWidth > 1550 && webWiew != DESKTOP_BIG) {

        weekChart.style.width = '45%';
        yearChart.style.width = '45%';
        monthChart.style.width = '50%';

        weekChart.style.float = 'left';
        yearChart.style.float = 'right';

        weekChart.style.marginBottom = 'auto';
        monthChart.style.marginBottom = '40px';
        yearChart.style.marginBottom = 'auto';

        sidebysideContainer.appendChild(weekChart);
        sidebysideContainer.appendChild(yearChart);
        chartContainer.appendChild(sidebysideContainer);
        chartContainer.appendChild(monthChart);

        webWiew = DESKTOP_BIG;
    }
}

document.addEventListener('DOMContentLoaded', updateWindowWidth);
window.addEventListener('resize', updateWindowWidth);


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
    fetch("http://192.168.68.63:5000/logout", { credentials: 'include' })
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
        window.location.reload()
    }, 2500);

});


document.addEventListener("DOMContentLoaded", function () {

    var ctx = document.getElementById("myChart").getContext("2d");

    // Initialize chart with empty data
    var data = {
        labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
        datasets: [{
            label: "Dati settimanali",
            backgroundColor: "rgba(0, 119, 182, 0.1)",
            borderColor: "rgba(0, 119, 182, 1)",
            borderWidth: 1,
            data: [0, 0, 0, 0, 0, 0, 0] // initial empty data
        }]
    };


    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };


    var myNewChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });

    function updateWeeklyBinData() {
        fetch('/weekbins')
            .then(response => response.json())
            .then(data => {
                let dataTotal = data.carta
                for (let i = 0; i < dataTotal.length; i++) {
                    dataTotal[i] += data.plastica[i];
                }
                myNewChart.data.datasets[0].data = dataTotal;
                console.log(dataTotal);
                myNewChart.update();
            })
            .catch(error => console.error('Error fetching weekly bin data:', error));
    }

    // Fetch weekly data on load and update the chart
    updateWeeklyBinData();
    setInterval(updateWeeklyBinData, 5000); // Update every 5 seconds
});

document.addEventListener("DOMContentLoaded", function () {

    var ctx = document.getElementById("myChart2").getContext("2d");


    function getRandomData(numPoints) {
        var data = [];
        for (var i = 0; i < numPoints; i++) {

            let num = Math.floor(Math.random() * 1000)
            if (num != 0) {
                data.push(num);
            }

        }
        return data;
    }


    var data = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
        datasets: [{
            label: "Dati mensili",
            backgroundColor: "rgba(0, 119, 182, 0.1)",
            borderColor: "rgba(0, 119, 182, 1)",
            borderWidth: 1,
            data: getRandomData(31)
        }]
    };


    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };


    var myNewChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
});

document.addEventListener("DOMContentLoaded", function () {

    var ctx = document.getElementById("myChart3").getContext("2d");


    function getRandomData(numPoints) {
        var data = [];
        for (var i = 0; i < numPoints; i++) {

            let num = Math.floor(Math.random() * 1000)
            if (num != 0) {
                data.push(num);
            }

        }
        return data;
    }


    var data = {
        labels: ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"],
        datasets: [{
            label: "Dati annuali",
            backgroundColor: "rgba(0, 119, 182, 0.1)",
            borderColor: "rgba(0, 119, 182, 1)",
            borderWidth: 1,
            data: getRandomData(12)
        }]
    };


    var options = {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    };


    var myNewChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
});

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

function setFullHeight() {
    const section = document.getElementById('binsHomeSection');
    section.style.height = `${document.documentElement.scrollHeight}px`;
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('DOMContentLoaded', setFullHeight);
