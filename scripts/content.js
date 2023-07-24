
// console.log("CONTENT SCRIPT LOADED");

const popup = document.createElement("div");
const header = document.createElement("h1");

function showPopup(previewModal, movieName) {

    popup.className = "info-popup";

    popup.style.position = 'fixed';
    popup.style.display = "block";
    popup.style.border = "3px outset";
    popup.style.padding = "10px";
    popup.style.color = 'black';
    popup.style.background = 'rgba(255, 255, 255, 0.8)';
    popup.style.zIndex = "999";
    popup.style.overflow = "hidden";
    popup.style.borderRadius = '12px';

    const imageRect = previewModal.getBoundingClientRect();

    const infoTop = imageRect.top;
    const infoLeft = imageRect.left;

    popup.style.top = infoTop/3 + 'px'; // change as needed later
    popup.style.left = infoLeft + 'px';
    popup.style.width = imageRect.width + 'px';



    header.textContent = movieName;
    header.style.textAlign = "center";
    popup.appendChild(header);

    
    document.body.appendChild(popup);


}


function detectHover() {
    let movieIMGs = document.querySelectorAll(".boxart-image");
    let hoverTimer;
    let previewModal = undefined;
    try {
        for (let movieIMG of movieIMGs) {
            movieIMG.onmouseenter = () => {
                // mouseleave bug solution (not exactly the best but it works)
                clearTimeout(hoverTimer);
                popup.style.display = 'none';
                
                setTimeout(() => {
                    previewModal = document.getElementsByClassName("previewModal--container mini-modal has-smaller-buttons")[0]
                    if (previewModal != null) {
                        console.log("on");
                        previewModal.onmouseleave = () => {
                            clearTimeout(hoverTimer);
                            popup.style.display = 'none';
                        }
                    }
                    console.log(previewModal);
                }, 500);


                hoverTimer = setTimeout(() => {
                    let movieName = movieIMG.nextElementSibling.textContent;

                    const data = chrome.runtime.sendMessage({movieName: movieName, movieYear: null});
                    console.log(data);
                    if (previewModal != null) {
                        showPopup(previewModal, movieName);
                    }
                }, 1000);

            }
            
        }
    } catch (error) {
        console.log(error);
    }
}

window.addEventListener("load", () => {
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) { 
            if (mutation.type === "childList") {
                detectHover();
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    detectHover();
});




