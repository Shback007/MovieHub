// https://www.omdbapi.com/?s=avengers&page=1&apikey=98c3cba0

const movieSearchBox =document.getElementById('movie-search-box') 
const searchList = document.getElementById('search-list');
const resultGrid = document.getElementById('result-grid');
//Load Movies from API 

const url='https://www.omdbapi.com/?s='
const apiKey = '98c3cba0'
async function loadMovies(searchMovie){
    const response = await fetch(url + searchMovie + `&page=1` + `&apikey=${apiKey}`)
    const data = await response.json();
    // console.log(data.Search);
    if(data.Response === "True") displayMovieList(data.Search);
}

movieSearchBox.addEventListener('keyup',()=>{
    findMovies();
})
movieSearchBox.addEventListener('click',()=>{
    findMovies();
})

function findMovies(){
    let searchMovie = (movieSearchBox.value).trim();
    if(searchMovie.length > 0){
        searchList.classList.remove('hide-search-list');
        loadMovies(searchMovie);
    }else{
        searchList.classList.add('hide-search-list')
    }
}



function displayMovieList(movies){
    searchList.innerHTML ="";
    for(let idx=0; idx < movies.length; idx++){
        let movieListItem = document.createElement('div');
        movieListItem.dataset.id = movies[idx].imdbID;
        movieListItem.classList.add('search-list-item');
        if(movies[idx].Poster !=="N/A")
            moviePoster = movies[idx].Poster;
        else
            moviePoster = "assets/noimg.png"

        movieListItem.innerHTML=
        `<div class="search-item-thumbnail">
            <img src=${moviePoster}>
        </div>
        <div class="search-item-info">
            <h3>${movies[idx].Title}</h3>
            <p>${movies[idx].Year}</p>
        </div>`;

        searchList.appendChild(movieListItem);
    }
    loadMovieDetails();
}

function loadMovieDetails(){
    const searchListMovies =searchList.querySelectorAll('.search-list-item');
    searchListMovies.forEach(movie =>{
        movie.addEventListener('click',async ()=>{
            // console.log(movie.dataset.id);
            searchList.classList.add('hide-search-list');
            movieSearchBox.value = "";
            const result = await fetch(`https://www.omdbapi.com/?i=${movie.dataset.id}&apikey=${apiKey}`)
            const movieDetails = await result.json();
            // console.log(movieDetails);
            displayMovieDetails(movieDetails);
        })
    })
}

function displayMovieDetails(details){
    resultGrid.innerHTML=`
        <div class="movie-poster">
            <img src=${(details.Poster !== "N/A") ? details.Poster: "assets/noimg.png"} alt="Movie Poster">
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${details.Title}</h3>
            <ul class="movie-misc-info">
                <li class="year">Year: ${details.Year}</li>
                <li class="rated">Ratings: ${details.Rated}</li>
                <li class="released">Released: ${details.Released}</li>
            </ul>
            <p class="genre"><b>Genre:</b> ${details.Genre}</p>
            <p class="writer"><b>writer:</b> ${details.Writer}</p>
            <p class="actors"><b>Actors:</b> ${details.Actors}</p>
            <p class="plot"><b>Plot:</b> ${details.Plot}</p>
            <p class="language"><b>Language:</b> ${details.Language}</p>
            <p class = "awards"><b><i class = "fas fa-award"></i></b> ${details.Awards}</p>
        </div>
    `;
}

window.addEventListener('click',(e)=>{
    if(e.target.className !=="form-control"){
        searchList.classList.add('hide-search-list');
    }
})