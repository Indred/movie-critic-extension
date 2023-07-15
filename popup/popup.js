let movieName;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
    movieName = message;
});


const testDiv = document.createElement("div");

testDiv.innerText = movieName;

document.body.appendChild(testDiv);