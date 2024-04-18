import navigateTo from './navigation.js'; 

document.getElementById('gameBtn').addEventListener('click', () => navigateTo('game'));
document.getElementById('leaderboardBtn').addEventListener('click', () => navigateTo('leaderboard'));

navigateTo('home');
