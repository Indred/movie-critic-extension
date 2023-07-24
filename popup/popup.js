const searchButton = document.getElementsByClassName("search-button")[0];
searchButton.addEventListener("click", () => {
    const movieTitle = document.getElementById("movieTitle").value;
    const movieYear = document.getElementById("movieYear").value;
    const data = chrome.runtime.sendMessage({movieName: movieTitle, movieYear: movieYear});
});


