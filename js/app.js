import Leaderboard from './leaderboard.js';
import Game from './game.js';

let playerX = null;
let playerO = null;
let game = null;
const leaderboard = new Leaderboard();

const dialog = document.querySelector('dialog')
const dialogButton = document.querySelector('dialog button')
const resetButton = document.getElementById('reset-button');
const leaderboardButton = document.getElementById('leaderboard-button');
const leaderboardDiv = document.getElementById('leaderboard');

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

/**
 * Add error class to the element for 850ms.
 * @param {HTMLElement} element 
 */
function addError(element) {
    element.classList.add('error');
    setTimeout(() => element.classList.remove('error'), 850);
}

/**
 * Validate the inputs - both must be non-empty and different.
 * @param {HTMLInputElement} inputX 
 * @param {HTMLInputElement} inputO 
 * @returns {boolean}
 */
function validateInput(inputX, inputO) {
    let isValid = true;
    if (inputX.value.trim() === '') {
        addError(inputX);
        isValid = false;
    }
    if (inputO.value.trim() === '') {
        addError(inputO);
        isValid = false;
    }
    if (inputX.value.trim() === inputO.value.trim()) {
        addError(inputX);
        addError(inputO);
        isValid = false;
    }
    return isValid;
}

dialogButton.addEventListener('click', e => {
    e.preventDefault();

    const inputX = dialog.querySelector('input[name="player-x"]');
    const inputO = dialog.querySelector('input[name="player-o"]');

    if (!validateInput(inputX, inputO)) {
        return;
    }

    playerX = inputX.value.trim();
    playerO = inputO.value.trim();

    inputX.value = '';
    inputO.value = '';

    dialog.close();

    // Game instance already exists => cleanup UI
    if (game) {
        game.cleanup();
    }
    game = new Game(playerX, playerO);
});

dialog.addEventListener('cancel', e => {
    e.preventDefault();
});

resetButton.addEventListener('click', () => {
    startNewGame();
});

startNewGame();
