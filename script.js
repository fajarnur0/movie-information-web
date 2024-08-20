const form = document.getElementById("form-search");
// EVENT WHEN THE INPUT FORM SUBMITTED
form.addEventListener("submit", async function (event) {
  event.preventDefault(); //PREVENT PAGE REFRESH
  // LOADING
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = spinner();
  // EXECUTION
  try {
    const inputKeyword = document.querySelector("#search-input").value;
    // GET MOVIES
    const movies = await getMovies(inputKeyword);
    // CHANGE UI DATA FROM GET MOVIES API
    updateUI(movies);
  } catch (e) {
    //ERROR HANDLING
    movieContainer.innerHTML = `<h3 class="mt-5 text-danger">${e.message}</h3>`;
  }
});

// EVENT BINDING WHEN MODAL MOVIE DETAIL CLICKED
document.addEventListener("click", async function (e) {
  if (e.target.classList.contains("modal-detail-button")) {
    // LOADING
    const movieDetailBody = document.querySelector(".modal-body");
    movieDetailBody.innerHTML = spinner();
    // EXECUTION
    try {
      const imdbid = e.target.dataset.imdbid;
      const movieDetail = await getMovieDetail(imdbid);
      updateUIDetail(movieDetail);
    } catch (e) {
      //ERROR HANDLING
      movieDetailBody.innerHTML = `<h3 class="my-5 text-danger text-center">${e.message}</h3>`;
    }
  }
});

// GET MOVIES FUNCTION USING FETCH API
function getMovies(keyword) {
  return fetch("https://www.omdbapi.com/?apikey=29524be0&s=" + keyword)
    .then((response) => {
      return statusHandle(response);
    })
    .then((response) => {
      // CONDITION IF API REQUEST FAILED
      if (response.Response === "False") {
        throw new Error(response.Error);
      }
      // RETURN FOR SUCCESS
      return response.Search;
    });
}

// GET MOVIE DETAIL
function getMovieDetail(id) {
  return fetch("https://www.omdbapi.com/?apikey=29524be0&i=" + id).then(
    (response) => {
      return statusHandle(response);
    }
  );
}

// UPDATE MOVIES UI FUNCTION
function updateUI(movies) {
  let cards = "";
  movies.forEach((m) => {
    cards += showCard(m);
  });
  const movieContainer = document.querySelector(".movie-container");
  movieContainer.innerHTML = cards;
}

// UPDATE MOVIE DETAIL UI FUNCTION
function updateUIDetail(movie) {
  const movieDetailUI = showMovieDetail(movie);
  const movieDetailBody = document.querySelector(".modal-body");
  movieDetailBody.innerHTML = movieDetailUI;
}

// RESPONSE STATUS HANDLING FUNCTION
function statusHandle(response) {
  // CONDITION IF FETCH API FAILED
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  // RETURN IF API REQUEST SUCCESSED
  return response.json();
}

function showCard(m) {
  return `<div class="col-md-4 my-3">
            <div class="card">
              <img src="${m.Poster}" class="card-img-top" />
              <div class="card-body">
                <h5 class="card-title">${m.Title}</h5>
                <h6 class="card-subtitle mb-2 text-muted">${m.Year}</h6>
                <a href="#" class="btn btn-primary modal-detail-button" data-imdbid="${m.imdbID}" data-bs-toggle="modal" data-bs-target="#movieDetailModal">Show Details</a>
              </div>
            </div>
          </div>`;
}

function showMovieDetail(m) {
  return `<div class="container-fluid">
            <div class="row">
              <div class="col-md-3">
                <img src="${m.Poster}" class="img-fluid" />
              </div>
              <div class="col-md">
                <ul class="list-group">
                  <li class="list-group-item"><h4>${m.Title} (${m.Year})</h4></li>
                  <li class="list-group-item">
                    <strong>Director : </strong> ${m.Director}
                  </li>
                  <li class="list-group-item">
                    <strong>Writer : </strong> ${m.Writer}
                  </li>
                  <li class="list-group-item">
                    <strong>Actors : </strong> ${m.Actors}
                  </li>
                  <li class="list-group-item">
                    <strong>Genre : </strong> ${m.Genre}
                  </li>
                  <li class="list-group-item">
                    <strong>Rating : </strong> ${m.Ratings.length ? m.Ratings[0].Value : "N/A"}
                  </li>
                  <li class="list-group-item">
                    <strong>Plot : </strong><br />${m.Plot}
                  </li>
                </ul>
              </div>
            </div>
          </div>`;
}

function spinner() {
  return `<div class="text-center my-5">
            <div class="spinner-border" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          </div>`;
}
