function logout() {
    fetch("http://192.168.68.63:5000/logout", { credentials: 'include' })
        .then(response => response.json())
        .then(data => {
            console.log(data.status);
        })
        .catch(error => console.log("Error logging out:", error));
}

for (let i = 1; i < 3; i++) {
    document.addEventListener("DOMContentLoaded", function () {
        // Crea la card
        var card = document.createElement('div');
        card.classList.add('card');
        card.classList.add('card');

        card.style = "width: 641px"
        card.style = "heigth: 400px"
        card.style = "margin-right: 10%"

        // Crea l'iframe
        var iframeTop = document.createElement('iframe');
        if (i == 1) {
            iframeTop.src = 'http://192.168.100.204:8000/bgr';
        }
        if (i == 2) {
            iframeTop.src = 'http://192.168.100.205:8000/bgr';
        }

        iframeTop.allow = 'autoplay';
        iframeTop.width = 1920
        iframeTop.height = 1080
        iframeTop.classList.add('card-img-top')

        card.appendChild(iframeTop);

        // Crea il corpo della card
        var cardBody = document.createElement('div');
        cardBody.className = 'card-body';

        // Crea il titolo della card
        var cardTitle = document.createElement('h5');
        cardTitle.className = 'card-title';
        cardTitle.textContent = 'Card title';

        // Crea il testo della card
        var cardText = document.createElement('p');
        cardText.className = 'card-text';
        cardText.textContent = 'Some quick example text to build on the card title and make up the bulk of the card\'s content.';

        // Crea il pulsante della card
        var cardButton = document.createElement('a');
        cardButton.classList.add('btn');
        cardButton.classList.add('btn-primary');
        cardButton.href = '#';
        cardButton.textContent = 'Go somewhere';

        // Aggiungi il titolo, il testo e il pulsante al corpo della card
        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(cardButton);

        // Aggiungi il corpo della card alla card
        card.appendChild(cardBody);



        // Aggiungi la card al container
        document.querySelector('#card-container').append(card);
    });

}