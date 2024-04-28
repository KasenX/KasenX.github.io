const PLAYER_X = 'X';
const PLAYER_O = 'O';
const TIE = 'T';
const SVGs = {
    X: '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="10"/><line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="10"/></svg>',
    O: '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="10" fill="none"/></svg>'
};
const WINNING_COMBOS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],    // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8],    // columns
    [0, 4, 8], [2, 4, 6]                // diagonals
];

export default class Game {

    #state;
    #board;

    #playerX
    #playerO

    #onTurn;
    #end = false;
    #endTimeout = false;
    #xWins = 0;
    #oWins = 0;
    #ties = 0;

    #xWinsTag;
    #oWinsTag;
    #tiesTag;

    #xSVG;
    #oSVG;
    #xSound;
    #oSound;

    #listeners = new Map();

    constructor(playerX, playerO) {
        this.#cacheDOMElements();
        this.#setupGame(playerX, playerO);
    }

    /**
     * Cleans up the UI and the instance properties.
     * The removal of the event listeners is necessary to prevent memory leaks.
     */
    cleanup() {
        this.#xWinsTag.textContent = 0;
        this.#oWinsTag.textContent = 0;
        this.#tiesTag.textContent = 0;

        this.#board.forEach(square => {
            square.innerHTML = '';
            square.classList.remove('win', 'irrelevant');
            const handler = this.#listeners.get(square);
            square.removeEventListener('click', handler);
        });
    }

    #cacheDOMElements() {
        this.#board = document.querySelectorAll('.square');
        this.#xWinsTag = document.getElementById('x-wins');
        this.#oWinsTag = document.getElementById('o-wins');
        this.#tiesTag = document.getElementById('ties');
    }

    #setupGame(playerX, playerO) {
        document.getElementById('x-name').textContent = this.#playerX = playerX;
        document.getElementById('o-name').textContent = this.#playerO = playerO;
        this.#resetBoard();
        this.#prepareAssets();
        this.#setupListeners();
    }

    /**
     * Resets the instance properties and the UI.
     */
    #resetBoard() {
        // Even number of rounds => next round is odd => X starts (and vice versa)
        this.#end = false;
        this.#onTurn = (this.#ties + this.#xWins + this.#oWins) % 2 === 0 ? PLAYER_X : PLAYER_O;
        this.#state = ['', '', '', '', '', '', '', '', ''];
        this.#board.forEach(square => {
            square.innerHTML = '';
            square.classList.remove('win', 'irrelevant');
        });
    }

    /**
     * Prepares the SVGs and sounds for the game.
     */
    #prepareAssets() {
        const parser = new DOMParser();
        this.#xSVG = parser.parseFromString(SVGs.X, 'image/svg+xml').documentElement;
        this.#oSVG = parser.parseFromString(SVGs.O, 'image/svg+xml').documentElement;

        this.#xSound = new Audio('assets/x_sound.wav');
        this.#oSound = new Audio('assets/o_sound.wav');
    }

    /**
     * Sets up the event listeners for the squares on the board.
     */
    #setupListeners() {
        this.#board.forEach((square, index) => {
            const handler = (e) => this.#handleClick(e, index);
            this.#listeners.set(square, handler);
            square.addEventListener('click', handler);
        });
    }

    /**
     * Handles the click event on a square.
     * @param {EventListener} e 
     * @param {Number} index 
     */
    #handleClick(e, index) {
        // Too early to start a new round
        if (this.#endTimeout) {
            return;
        }
        // Game is in the end state => start a new round
        if (this.#end) {
            this.#resetBoard();
            return;
        }

        // Square already taken
        if (this.#state[index] !== '') {
            return;
        }

        this.#makeMove(e, index);
        this.#processEndGame();
    }

    /**
     * Updates the state, makes a move on the UI, plays the sound and switches the turn.
     * @param {EventListener} e 
     * @param {Number} index 
     */
    #makeMove(e, index) {
        this.#state[index] = this.#onTurn;
        const svg = this.#onTurn === PLAYER_X ? this.#xSVG : this.#oSVG;
        const sound = this.#onTurn === PLAYER_X ? this.#xSound : this.#oSound;
        e.target.appendChild(svg.cloneNode(true));
        sound.pause();
        sound.currentTime = 0;
        sound.play();
        this.#onTurn = this.#onTurn === PLAYER_X ? PLAYER_O : PLAYER_X;
    }

    /**
     * Checks if the game has ended and processes the end of the game.
     */
    #processEndGame() {
        const winner = this.#checkWinner();
        if (winner !== null) {
            this.#endRound(winner);
        }
    }

    /**
     * Checks if there is a winning combination on the board.
     * @returns {Array} empty array if tie, null if no winner yet, otherwise the winning combo
     */
    #checkWinner() {
        for (const combo of WINNING_COMBOS) {
            const [a, b, c] = combo;

            if (this.#state[a] && this.#state[a] === this.#state[b] && this.#state[a] === this.#state[c]) {
                return combo;
            }
        }

        // No empty squares without a winner => tie
        if (!this.#state.includes('')) {
            return [];
        }

        return null;
    }

    /**
     * Updates the instance properties, UI and local storage.§
     * Winning combo squares are highlighted and blinking for 1.5 seconds.
     * @param {Array} winningCombo empty array if tie
     */
    #endRound(winningCombo) {
        const winner = winningCombo.length === 0 ? TIE : this.#state[winningCombo[0]];

        this.#board.forEach((square, index) => {
            if (winningCombo.includes(index)) {
                square.classList.add('win');
                square.querySelector('svg').classList.add('blinking');
                setTimeout(() => { square.querySelector('svg').classList.remove('blinking') }, 1500);
            }
            else {  
                square.classList.add('irrelevant');
            }
        })

        this.#end = true;
        // Set a timeout to prevent immediate reset of the board
        this.#endTimeout = true;
        setTimeout(() => { this.#endTimeout = false; }, 1500);

        this.#saveScore(winner);
        this.#updateScore(winner);
    }

    /**
     * Updates the local storage.
     * Get the number of wins for the winner from the local storage and increment it by 1.
     * @param {string} winner 
     */
    #saveScore(winner) {
        if (winner === PLAYER_X) {
            const scoreX = localStorage.getItem(this.#playerX) ?? 0;
            localStorage.setItem(this.#playerX, parseInt(scoreX) + 1);
        }
        else if (winner === PLAYER_O) {
            const scoreO = localStorage.getItem(this.#playerO) ?? 0;
            localStorage.setItem(this.#playerO, parseInt(scoreO) + 1);
        }
    }

    /**
     * Updates the instance properties and UI.
     * Updated number in the UI is blinking for 15 ms.
     * @param {string} winner 
     */
    #updateScore(winner) {
        if (winner === TIE) {
            this.#ties++;
            this.#tiesTag.textContent = this.#ties;
            this.#tiesTag.classList.add('blinking');
            setTimeout(() => { this.#tiesTag.classList.remove('blinking'); }, 1500);
        } else if (winner === PLAYER_X) {
            this.#xWins++;
            this.#xWinsTag.textContent = this.#xWins;
            this.#xWinsTag.classList.add('blinking');
            setTimeout(() => { this.#xWinsTag.classList.remove('blinking'); }, 1500);
        } else if (winner === PLAYER_O) {
            this.#oWins++;
            this.#oWinsTag.textContent = this.#oWins;
            this.#oWinsTag.classList.add('blinking');
            setTimeout(() => { this.#oWinsTag.classList.remove('blinking'); }, 1500);
        }
    }
}
