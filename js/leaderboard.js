export default class Leaderboard {

    #page
    #tbody;

    constructor() {
        this.#page = document.getElementById('leaderboard');
        this.#tbody = this.#page.querySelector('tbody');
    }

    show() {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            this.#addRow(key, value);
        }

        this.#page.style.display = 'block';
    }

    hide() {
        this.#page.style.display = 'none';
        this.#tbody.innerHTML = '';
    }

    #addRow(name, wins) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${name}</td>
            <td>${wins}</td>
        `;
        this.#tbody.appendChild(row);
    }
}
