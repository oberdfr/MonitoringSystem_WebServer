function logout() {
    fetch("http://192.168.100.106:5000/logout", { credentials: 'include' })
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

        if (i == 1) {
            card.className = 'cardLeft';
        } else if (i == 2) {
            card.className = 'cardLeft';
        }


        // Crea l'iframe
        var iframe = document.createElement('iframe');
        iframe.src = 'http://192.168.100.204:8000/bgr';
        iframe.allow = 'autoplay';
        iframe.width = 1920
        iframe.height = 1080

        var cardIframeContainer = document.createElement('div');
        cardIframeContainer.classList.add('iframeContainer');
        // Aggiungi l'iframe alla card
        cardIframeContainer.appendChild(iframe);
        card.appendChild(cardIframeContainer);

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
        cardButton.className = 'card-btn';
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