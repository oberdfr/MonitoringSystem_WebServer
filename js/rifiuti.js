
document.addEventListener("DOMContentLoaded", function() {

    var ctx = document.getElementById("myChart").getContext("2d");


    function getRandomData(numPoints) {
        var data = [];
        for (var i = 0; i < numPoints; i++) {
            
            let num = Math.floor(Math.random() * 1000)
            if(num!=0){
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

document.addEventListener("DOMContentLoaded", function() {

    var ctx = document.getElementById("myChart2").getContext("2d");


    function getRandomData(numPoints) {
        var data = [];
        for (var i = 0; i < numPoints; i++) {
            
            let num = Math.floor(Math.random() * 1000)
            if(num!=0){
                data.push(num);
            }
            
        }
        return data;
    }


    var data = {
        labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20", "21","22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
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

document.addEventListener("DOMContentLoaded", function() {

    var ctx = document.getElementById("myChart3").getContext("2d");


    function getRandomData(numPoints) {
        var data = [];
        for (var i = 0; i < numPoints; i++) {
            
            let num = Math.floor(Math.random() * 1000)
            if(num!=0){
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
