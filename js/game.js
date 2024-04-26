export default class Game {

    #state;
    #board;

    #onTurn = 'X'; // Odd rounds => X starts, even rounds => O starts
    #xWins = 0;
    #oWins = 0;
    #ties = 0;

    constructor() {
        this.#state = ['', '', '', '', '', '', '', '', ''];
        this.#board = document.querySelectorAll('.square');

        this.#board.forEach((square, index) => square.addEventListener('click', e => this.#handleClick(e, index)));
    }

    #handleClick(e, index) {
        // Square already taken
        if (this.#state[index] !== '') {
            return;
        }

        this.#state[index] = this.#onTurn;
        e.target.textContent = this.#onTurn;
        this.#onTurn = this.#onTurn === 'X' ? 'O' : 'X';
        
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
                return this.#state[a];
            }
        }

        // No empty squares without a winner => tie
        if (!this.#state.includes('')) {
            return 'T';
        }

        return null;
    }

    #endRound(winner) {
        if (winner === 'T') {
            this.#ties++;
        } else if (winner === 'X') {
            this.#xWins++;
        } else if (winner === 'O') {
            this.#oWins++;
        }

        this.#updateScore();
        this.#resetBoard();
    }

    #updateScore() {
        document.querySelector('#x-wins').textContent = this.#xWins;
        document.querySelector('#o-wins').textContent = this.#oWins;
        document.querySelector('#ties').textContent = this.#ties;
    }

    #resetBoard() {
        // Even number of rounds => next round is odd => X starts (and vice versa)
        this.#onTurn = (this.#ties + this.#xWins + this.#oWins) % 2 === 0 ? 'X' : 'O';
        this.#state = ['', '', '', '', '', '', '', '', ''];
        this.#board.forEach(square => square.textContent = '');
    }
}
