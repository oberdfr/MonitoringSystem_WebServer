
document.addEventListener("DOMContentLoaded", function () {

    var ctx = document.getElementById("myChart").getContext("2d");


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
        labels: ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"],
        datasets: [{
            label: "Dati settimanali",
            backgroundColor: "rgba(0, 119, 182, 0.1)",
            borderColor: "rgba(0, 119, 182, 1)",
            borderWidth: 1,
            data: getRandomData(7)
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
    fetch("http://192.168.100.106:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}


// percentage meters
document.addEventListener('DOMContentLoaded', function () {
    function fillCircle(type, percentage) {
        const circle = document.getElementById(`circle${type.charAt(0).toUpperCase() + type.slice(1)}`);
        const text = circle.nextElementSibling;
        const radius = 12.9155;
        const circumference = 2 * Math.PI * radius;
        const offset = circumference - (percentage / 100) * circumference;

        circle.style.strokeDasharray = `${circumference} ${circumference}`;
        circle.style.strokeDashoffset = `${circumference}`;

        setTimeout(() => {
            circle.style.strokeDashoffset = `${offset}`;
            text.textContent = `${percentage}%`;
        }, 10);
    }

    fillCircle('carta', 70); // Change 70 to the desired percentage
    fillCircle('plastica', 85); // Change 85 to the desired percentage
});