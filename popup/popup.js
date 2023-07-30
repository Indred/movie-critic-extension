const searchButton = document.getElementsByClassName("search-button")[0];
const popup = document.createElement("div");
const search_div = document.getElementsByClassName("search-button")[0];
const notFound = document.createElement("div");
search_div.appendChild(notFound);
notFound.style.display = "none";
notFound.style.marginTop = "1rem";
notFound.style.fontWeight = "bold";
notFound.style.color = "red";
notFound.innerText = "Movie not found!";


let OPENAI_API_KEY;
chrome.storage.local.get(['OPENAI_API_KEY'], function (result) {
    OPENAI_API_KEY = result.OPENAI_API_KEY;
});


async function getCritique(movie) {
    try {
        const openai_response = await fetch(`https://api.openai.com/v1/chat/completions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`, // Corrected here
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a movie/series critic. Critique the movie/series sent in 50 words.' },
                    { role: 'user', content: movie.name },
                ],     
                max_tokens: 80,
                temperature: 0.7,
            }),
        });
        
        const openai_data = await openai_response.json();
        console.log(openai_data);
        movie.critique = openai_data.choices[0].message.content;
    } catch (error) {
        console.log(error);
    }

    return movie;
}

function updatePopup(movie) {

    const loader = popup.querySelector(".loader");
    loader.style.display = "none";

    const critique = popup.querySelector(".critique");
    critique.style.cssText = `
    margin-top: 0.25rem;
    font-size: 0.8rem;
    `;

    critique.textContent = movie.critique;
}


searchButton.addEventListener("click", () => {
    const movieTitle = document.getElementById("movieTitle").value;
    const movieYear = document.getElementById("movieYear").value;
    (async () => {
        notFound.style.display = "none";
        const response = await chrome.runtime.sendMessage({movieName: movieTitle, movieYear: movieYear});
        if (response.movie.Response === "True") {
            showData(response.movie);
            (async () => {
                const movie = await getCritique(response.movie);
                updatePopup(movie);
            })();
        } else {
            notFound.style.display = "block";

        }
    })();

});




function showData(movie) {
    const main = document.querySelector("main");
    main.style.display = "none";
    popup.innerHTML = `
    <div class="header">
        <div class="left">
            <h1>${movie.name}</h1>
            <ul>
                <li>${movie.year}</li>
                <li>${movie.runtime}</li>
                <li>${movie.genre}</li>
            <ul>
        </div>
        <div class="right">
            <div class="imdb">
                <div class="imdb-rating">⭐: ${movie.imdbRating}/10</div>
                <div class="imdb-votes">👤: ${movie.imdbVotes}</div>
            </div>
            <div class="rotten-tomatoes">🍅: ${movie.rottenTomatoesRating}</div>
            <div class="box-office">💰: ${movie.BoxOffice}</div>
        </div>
    </div>
    <div class="body">
        <div class="hero">
            <div class="actors">🎭: ${movie.actors}</div>
            <div class="awards">🏆: ${movie.awards}</div>
        </div>
        <div class="critique-container">
            <h1 class="clapperboard">Critique 🎬</h1>
            <div class="critique"></div>
            <div class="loader"></div>
        </div>
    </div>
    <div class="footer">
        <button class="search-again">Return To Main</button>
    </div>
    `
    document.body.appendChild(popup);

    // header
    const header = popup.querySelector(".header");
    header.style.cssText = `
    display: flex;
    justify-content: space-between;
    margin: 0.5rem;
    `;

    //left
    const left = popup.querySelector(".left");
    left.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
    `;

    //right
    const right = popup.querySelector(".right");
    right.style.cssText = `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    `;


    //title
    const title = popup.querySelector("h1");
    title.style.cssText =`
    text-align: left;
    font-size: 1rem;
    margin: 0;
    padding: 0;
    `;

    // list
    const list = popup.querySelector("ul");
    list.style.cssText = `
    list-style: none;
    padding: 0;
    margin: 0;
    font-size: 0.8rem;
    `;


    // hero
    const hero = popup.querySelector(".hero");
    hero.style.cssText = `
    display: flex;
    flex-direction: column;
    margin: 0.5rem;
    margin-top: 0.75rem;
    gap: 0.5rem;
    border-top: 1px solid rgba(0,0,0,.06);
    border-bottom: 1px solid rgba(0,0,0,.06);
    padding: 0.5rem;
    `;

    //actors
    const actors = popup.querySelector(".actors");
    actors.style.cssText = `
    font-size: 0.8rem;
    `;

    //awards
    const awards = popup.querySelector(".awards");
    awards.style.cssText = `
    font-size: 0.8rem;
    `;


    // button
    const searchAgain = popup.querySelector(".search-again");
    searchAgain.style.cssText = `
    text-align: center;
    margin: 12px;
    background: red;
    border: 1px solid red;
    border-radius: 6px;
    box-shadow: rgba(0, 0, 0, 0.1) 1px 2px 4px;
    box-sizing: border-box;
    color: #FFFFFF;
    cursor: pointer;
    display: inline-block;
    font-family: nunito,roboto,proxima-nova,"proxima nova",sans-serif;
    font-size: 14px;
    font-weight: 800;
    outline: 0;
    padding: 6px 12px;
    text-align: center;
    text-rendering: geometricprecision;
    text-transform: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
    vertical-align: middle;
    `;
    searchAgain.onmouseenter = () => {
        searchAgain.style.backgroundColor = 'initial';
        searchAgain.style.backgroundPosition = '0 0';
        searchAgain.style.color = 'red';
    }

    searchAgain.onmouseleave = () => {
        searchAgain.style.backgroundColor = 'red';
        searchAgain.style.backgroundPosition = '0 0';
        searchAgain.style.color = 'white';
    }

    searchAgain.onmousedown = () => {
        searchAgain.style.opacity = '0.5';
    }

    searchAgain.onmouseup = () => {
        searchAgain.style.opacity = '1';
    }    

    searchAgain.onclick = () => {
        popup.style.display = "none";
        main.style.display = "block";
    }

    //critique-container
    const critiqueContainer = popup.querySelector(".critique-container");
    critiqueContainer.style.cssText = `
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0.5rem;
    margin-top: 0.75rem;
    margin-bottom: 0.75rem;
    gap: 0.5rem;
    `;

    //clapperboard
    const clapperboard = popup.querySelector(".clapperboard");
    clapperboard.style.cssText = `
    margin: 0;
    padding: 0;
    `;
    clapperboard.style.fontSize = "1rem";

    //loader
    const loader = popup.querySelector(".loader");
    loader.style.cssText = `
    border: 4px solid #f3f3f3; /* Light grey */
    border-top: 4px solid red; /* Blue */
    border-radius: 50%;
    width: 15px;
    height: 15px;
    animation: spin 0.5s linear infinite;
    `;



    const keyframes = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    `;
    const style = document.createElement("style");
    style.innerHTML = keyframes;
    document.head.appendChild(style);

    

    // footer
    const footer = popup.querySelector(".footer");
    footer.style.cssText = `
    border-top: 1px solid rgba(0,0,0,.06);
    text-align: center;
    `;


    popup.style.display = "block";
}

