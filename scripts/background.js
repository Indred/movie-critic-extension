const apiKeyConfig = require('./api-key-config.js');
const API_KEY = "";

let movie = new Object();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    movie.name = message.movieName;
    if (message.movieYear != null) {
        movie.year = message.movieYear;
    }
    console.log("Data received: " + movie.name + " " + movie.year);

    async function getMovieData() {
        movie.name.split(' ').join('+');
        const response = await fetch(`https://www.omdbapi.com/?apikey=d7786aee&t=${movie.name}&plot=full&y=${movie.year}`);
        const data = await response.json();

        console.log(data);
    }
});