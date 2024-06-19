let sidebar = document.querySelector(".sidebar");
let closeBtn = document.querySelector("#btn");
let searchBtn = document.querySelector(".bx-search");
let logoutBtn = document.querySelector("#logout-button");
let containerSide = document.getElementById('containerSide-by-side');
let card1 = document.getElementById('card1');
let card2 = document.getElementById('card2');
resultCams = document.getElementById('resultCams');

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

function isMobileDevice() {
  console.log(/Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent));
  return /Mobi|Android|iPad|iPhone|iPod/.test(navigator.userAgent);
}

const DESKTOP_BIG = 1;
const DESKTOP_LITTLE = 2;

var windowWidth = window.innerWidth;
var webWiew = 4;

function updateWindowWidth() {

  windowWidth = window.innerWidth;


  if ((isMobileDevice() || windowWidth <= 1600) && webWiew != DESKTOP_LITTLE) {
    card1.style.float = 'none';
    card2.style.float = 'none';

    resultCams.appendChild(card1);
    resultCams.appendChild(card2);

    webWiew = DESKTOP_LITTLE;
  }

  if (windowWidth > 1600 && webWiew != DESKTOP_BIG) {
    card1.style.float = 'left';
    card2.style.float = 'right';

    containerSide.appendChild(card1);
    containerSide.appendChild(card2);
    webWiew = DESKTOP_BIG;
  }
}

document.addEventListener('DOMContentLoaded', updateWindowWidth);
window.addEventListener('resize', updateWindowWidth);

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
    window.location.reload()
  }, 2500);

});

function setFullHeight() {
  const section = document.getElementById('camHomeSection');
  section.style.height = `${document.documentElement.scrollHeight}px`;
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('DOMContentLoaded', setFullHeight);

function setNPeople(peoplePP, peopleS) {
  peopleScont = document.getElementById('nPeople-s');
  peoplePPcont = document.getElementById('nPeople-pp');

  peopleScont.innerHTML = parseInt(peopleS);
  peoplePPcont.innerHTML = parseInt(peoplePP);

}

function updateNPeople() {
  fetch('/latestpeople')
    .then(response => response.json())
    .then(data => {
      setNPeople(data.primopiano, data.seminterrato);
    })
    .catch(error => console.error('Error fetching people data:', error));
}

document.addEventListener('DOMContentLoaded', function () {
  updateNPeople();
  setInterval(updateNPeople, 1 * 1000); // Update every 1 seconds
});
