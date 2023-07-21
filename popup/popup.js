function SearchMovie() {
    const searchButton = document.getElementById("search-button");
    searchButton.addEventListener("click", () => {
        const movieTitle = document.getElementById("movieTitle").value;
        const movieYear = document.getElementById("movieYear").value;
        const response = (async () => await chrome.runtime.sendMessage({movieName: movieTitle, movieYear: movieYear}));
    });
}