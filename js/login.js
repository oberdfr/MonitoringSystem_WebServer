const username = document.getElementById('user');
const pwd = document.getElementById('pwd');
const btn = document.getElementById('btn');

function getPwd() {
    return pwd.value;
}

function getUser() {
    return username.value;
}

function posso() {
    let pwd = getPwd();
    console.log(pwd);
    let user = getUser();
    console.log(user);
    let string = "http://192.168.1.180:5000/posso?user=" + user + "&pwd=" + pwd;

    fetch(string)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.status === "success") {
                console.log(data.path);
                window.location.href = data.path;
            }
        })
        .catch(error => console.log("Si è verificato un errore!"));
}

btn.addEventListener('click', posso);