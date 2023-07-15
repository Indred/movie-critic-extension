let movie = new Object();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    movie.name = message.movieName;
    console.log("Data received: " + movie.name);
});