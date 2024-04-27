export default class Game {

    #state;
    #board;

    #playerX
    #playerO

    #onTurn = 'X'; // Odd rounds => X starts, even rounds => O starts
    #end = false;
    #endTimeout = false;
    #xWins = 0;
    #oWins = 0;
    #ties = 0;

    #xWinsTag = document.getElementById('x-wins');
    #oWinsTag = document.getElementById('o-wins');
    #tiesTag = document.getElementById('ties');

    #xSVGstring = '<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" stroke-width="10"/><line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" stroke-width="10"/></svg>';
    #oSVGstring = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="30" stroke="currentColor" stroke-width="10" fill="none"/></svg>';
    #xSVG;
    #oSVG;
    #xSound;
    #oSound;

    #listeners = new Map();

    constructor(playerX, playerO) {
        document.getElementById('x-name').textContent = this.#playerX = playerX;
        document.getElementById('o-name').textContent = this.#playerO = playerO;

        this.#state = ['', '', '', '', '', '', '', '', ''];
        this.#board = document.querySelectorAll('.square');
        this.#setupListeners();

        this.#prepareAssets();
    }

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

    #setupListeners() {
        this.#board.forEach((square, index) => {
            const handler = (e) => this.#handleClick(e, index);
            this.#listeners.set(square, handler);
            square.addEventListener('click', handler);
        });
    }

    #handleClick(e, index) {
        if (this.#endTimeout) {
            return;
        }
        if (this.#end) {
            this.#end = false;
            this.#resetBoard();
            return;
        }

        // Square already taken
        if (this.#state[index] !== '') {
            return;
        }

        this.#state[index] = this.#onTurn;

        if (this.#onTurn === 'X') {
            e.target.appendChild(this.#xSVG.cloneNode(true));
            this.#xSound.pause();
            this.#xSound.currentTime = 0;
            this.#xSound.play();
            this.#onTurn = 'O';
        } else {
            e.target.appendChild(this.#oSVG.cloneNode(true));
            this.#oSound.pause();
            this.#oSound.currentTime = 0;
            this.#oSound.play();
            this.#onTurn = 'X';
        }
        
        const winner = this.#checkWinner();

        if (winner !== null) {
            this.#endRound(winner);
        }
    }

    #checkWinner() {
        const winningCombos = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],    // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8],    // columns
            [0, 4, 8], [2, 4, 6]                // diagonals
        ];

        for (const combo of winningCombos) {
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

    #endRound(winningCombo) {
        const winner = winningCombo.length === 0 ? 'T' : this.#state[winningCombo[0]];

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
        this.#endTimeout = true;
        setTimeout(() => { this.#endTimeout = false; }, 1500);

        this.#saveScore(winner);
        this.#updateScore(winner);
    }

    #saveScore(winner) {
        if (winner === 'X') {
            const scoreX = localStorage.getItem(this.#playerX) ?? 0;
            localStorage.setItem(this.#playerX, parseInt(scoreX) + 1);
        }
        else if (winner === 'O') {
            const scoreO = localStorage.getItem(this.#playerO) ?? 0;
            localStorage.setItem(this.#playerO, parseInt(scoreO) + 1);
        }

    }

    #updateScore(winner) {
        if (winner === 'T') {
            this.#ties++;
            this.#tiesTag.textContent = this.#ties;
            this.#tiesTag.classList.add('blinking');
            setTimeout(() => { this.#tiesTag.classList.remove('blinking'); }, 1500);
        } else if (winner === 'X') {
            this.#xWins++;
            this.#xWinsTag.textContent = this.#xWins;
            this.#xWinsTag.classList.add('blinking');
            setTimeout(() => { this.#xWinsTag.classList.remove('blinking'); }, 1500);
        } else if (winner === 'O') {
            this.#oWins++;
            this.#oWinsTag.textContent = this.#oWins;
            this.#oWinsTag.classList.add('blinking');
            setTimeout(() => { this.#oWinsTag.classList.remove('blinking'); }, 1500);
        }
    }

    #resetBoard() {
        // Even number of rounds => next round is odd => X starts (and vice versa)
        this.#onTurn = (this.#ties + this.#xWins + this.#oWins) % 2 === 0 ? 'X' : 'O';
        this.#state = ['', '', '', '', '', '', '', '', ''];
        this.#board.forEach(square => {
            square.innerHTML = '';
            square.classList.remove('win', 'irrelevant');
        });
    }

    #prepareAssets() {
        const parser = new DOMParser();
        this.#xSVG = parser.parseFromString(this.#xSVGstring, 'image/svg+xml').documentElement;
        this.#oSVG = parser.parseFromString(this.#oSVGstring, 'image/svg+xml').documentElement;

        this.#xSound = new Audio('assets/x_sound.wav');
        this.#oSound = new Audio('assets/o_sound.wav');
    }
}
