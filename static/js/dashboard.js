
let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let logoutBtn = document.querySelector("#logout-button");

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
    fetch("http://192.168.100.104:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}
