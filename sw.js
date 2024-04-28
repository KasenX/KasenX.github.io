const CACHE_NAME = "offline";
const urlsToCache = [
	".",
	"index.html",
	"css/style.css",
	"css/animations.css",
	"js/app.js",
	"js/game.js",
	"js/leaderboard.js",
	"assets/favicon.ico",
	"assets/Jersey25-Regular.ttf",
	"assets/x_sound.wav",
	"assets/o_sound.wav"
];

async function precache() {
	const cache = await caches.open(CACHE_NAME);
	return cache.addAll(urlsToCache);
};

async function respondTo(request) {
	const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);

    try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
    } catch (e) { // offline or fetch failed
        if (cached) {
            return cached; // return the cached response if available
        } else {
            throw new Error('The network is unavailable and no cached version is available.');
        }
    }
};

async function onInstall(e) {
	self.skipWaiting();
	e.waitUntil(precache());
}

async function onFetch(e) {
	e.respondWith(respondTo(e.request));
}

self.addEventListener("install", onInstall);
self.addEventListener("fetch", onFetch);