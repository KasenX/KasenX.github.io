import Leaderboard from './leaderboard.js';
import Game from './game.js';

let playerX = null;
let playerO = null;
let game = null;

const dialog = document.querySelector('dialog')
const dialogButton = document.querySelector('dialog button')
const resetButton = document.getElementById('reset-button');
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardDiv = document.getElementById('leaderboard');

const leaderboard = new Leaderboard();

leaderboardButton.addEventListener('click', () => {
    if (leaderboardDiv.style.display === 'none') {
        leaderboard.show();
    }
    else {
        leaderboard.hide();
    }
});

function startNewGame() {
    dialog.showModal();
}

dialogButton.addEventListener('click', event => {
    event.preventDefault();

    const inputX = dialog.querySelector('input[name="player-x"]');
    const inputO = dialog.querySelector('input[name="player-o"]');

    if (inputX.value.trim() === inputO.value.trim()) {
        inputX.classList.add('error');
        setTimeout(() => { inputX.classList.remove('error'); }, 850);
        inputO.classList.add('error');
        setTimeout(() => { inputO.classList.remove('error'); }, 850);
        return;
    }
    if (inputX.value.trim() === '') {
        valid = false;
        inputX.classList.add('error');
        setTimeout(() => { inputX.classList.remove('error'); }, 850);
    }
    if (inputO.value.trim() === '') {
        valid = false;
        inputO.classList.add('error');
        setTimeout(() => { inputO.classList.remove('error'); }, 850);
    }
    if (inputX.value.trim() === '' || inputO.value.trim() === '') {
        return;
    }

    playerX = inputX.value.trim();
    playerO = inputO.value.trim();
    inputX.value = inputO.value = '';

    dialog.close();

    if (game) {
        game.cleanup();
    }
    game = new Game(playerX, playerO);
});

dialog.addEventListener('cancel', event => {
    event.preventDefault();
});

resetButton.addEventListener('click', () => {
    startNewGame();
});

startNewGame();
