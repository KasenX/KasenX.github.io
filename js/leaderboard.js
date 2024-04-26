export default class Leaderboard {

    #page
    #tbody;

    constructor() {
        this.#page = document.getElementById('leaderboard');
        this.#tbody = this.#page.querySelector('tbody');
    }

    show() {
        const entries = []

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
            entries.push([key, value]);   
        }

        entries.sort((a, b) => b[1] - a[1]);

        for (const [name, wins] of entries) {
            this.#addRow(name, wins);
        }

        this.#page.style.display = 'flex';
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
