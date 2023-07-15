
console.log("CONTENT SCRIPT LOADED");

let movieName;

function getMovieName(movieIMG) {
    console.log("hovered");
    console.log(movieIMG.nextElementSibling.textContent);
}

function detectHover() {
    let movieIMGs = document.querySelectorAll(".boxart-image");
    try {
        movieIMGs.forEach((movieIMG) => {
            movieIMG.onmouseover = () => {
                setTimeout(() => {
                console.log("hovered");
                console.log(movieIMG.nextElementSibling.textContent);
                movieName = movieIMG.nextElementSibling.textContent;
                (async () => {
                    const respone = await chrome.runtime.sendMessage({movieName: movieName});
                    console.log(respone);
                });
                }, 1000);
            }
        });
    } catch (error) {
        console.log(error);
    }
}


const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) { 
        if (mutation.type === "childList") {
            detectHover();
        }
    }
});

observer.observe(document.body, { childList: true, subtree: true });