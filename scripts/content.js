
console.log("CONTENT SCRIPT LOADED");

const popup = document.createElement("div");
const header = document.createElement("h1");

function showPopup(movieIMG, movieName) {

    popup.className = "info-popup";

    popup.style.position = 'fixed';
    popup.style.display = "block";
    popup.style.border = "1px solid #ccc";
    popup.style.padding = "10px";
    popup.style.color = 'black';
    popup.style.background = 'rgba(255, 255, 255, 0.8)';
    popup.style.zIndex = "999";
    popup.style.borderRadius = '6 px';

    const imageRect = movieIMG.getBoundingClientRect();

    const infoTop = imageRect.top;
    const infoLeft = imageRect.left;

    popup.style.top = infoTop/2.5 + 'px'; // change as needed later
    popup.style.left = infoLeft - (imageRect.width/1.5)/2 + 'px';
    popup.style.width = imageRect.width*1.5 + 'px';



    header.textContent = movieName;
    header.style.textAlign = "center";
    popup.appendChild(header);

    
    document.body.appendChild(popup);


}

function detectHover() {
    let movieIMGs = document.querySelectorAll(".boxart-image");
    try {
        movieIMGs.forEach((movieIMG) => {
            movieIMG.onmouseenter = () => {
                const hoverTimer = setTimeout(() => {
                    console.log("hovered");
                    
                    console.log(movieIMG.nextElementSibling.textContent);

                    let movieName = movieIMG.nextElementSibling.textContent;
                    const response = (async () => await chrome.runtime.sendMessage({movieName: movieName}));

                    showPopup(movieIMG, movieName);
                }, 1500);
                movieIMG.onmouseleave = () => {
                    //clearTimeout(hoverTimer);
                    popup.style.display = 'none';
                    console.log("off");
                }
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



