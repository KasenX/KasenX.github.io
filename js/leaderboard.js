export default class Leaderboard {

    #page
    #tbody;

    constructor() {
        this.#page = document.getElementById('leaderboard');
        this.#tbody = this.#page.querySelector('tbody');
    }

    /**
     * Show the leaderboard.
     * Get all entries from the local storage, sort them by the number of wins and display them in the table.
     */
    show() {
        const entries = []

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            entries.push([key, value]);   
        }

        entries.sort((a, b) => b[1] - a[1]);

        for (const [name, wins] of entries) {
            this.#tbody.appendChild(this.#getRow(name, wins));
        }

        this.#page.style.display = 'flex';
    }

    /**
     * Hide the leaderboard.
     * Set the display property of the page to 'none' and clear the table body.
     */
    hide() {
        this.#page.style.display = 'none';
        this.#tbody.innerHTML = '';
    }

    /**
     * Return a new td element with the given name and number of wins.
     * @param {string} name 
     * @param {string} wins 
     * @returns {HTMLTableRowElement}
     */
    #getRow(name, wins) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${wins}</td>
        `;
        return row;
    }
}
