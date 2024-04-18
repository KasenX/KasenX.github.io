const pages = {
    home: document.getElementById('homePage'),
    game: document.getElementById('gamePage'),
    leaderboard: document.getElementById('leaderboardPage')
}

export default page => {
    Object.values(pages).forEach(p => p.style.display = 'none');
    pages[page].style.display = 'block';
};
