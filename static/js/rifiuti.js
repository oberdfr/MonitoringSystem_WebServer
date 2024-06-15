
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
                myNewChart.data.datasets[0].data = data.carta + data.plastica;
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

function logout() {
    fetch("http://192.168.68.63:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}

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
