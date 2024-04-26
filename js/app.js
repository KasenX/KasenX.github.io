import Game from './game.js';

let playerX = null;
let playerO = null;

const dialog = document.querySelector('dialog')
const dialogButton = document.querySelector('dialog button')

dialogButton.addEventListener('click', event => {
    event.preventDefault();

    playerX = dialog.querySelector('input[name="player-x"]').value;
    playerO = dialog.querySelector('input[name="player-o"]').value;

    if (playerX === '' || playerO === '') {
        return;
    }

    dialog.close();
});

dialog.addEventListener('cancel', event => {
    event.preventDefault();
});

dialog.addEventListener('close', () => {
    const game = new Game(playerX, playerO);
})

dialog.showModal();
