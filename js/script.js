const url = "https://japceibal.github.io/japflix_api/movies-data.json";
let movies = [];

document.addEventListener("DOMContentLoaded", async () => {
    try{
        const response = await fetch(url);
        movies = await response.json();
        //console.log(movies)
    } catch(error){
        console.error("Error al obtener las peliculas:", error);
    }
});

function stars(rating) {
  const stars = rating / 2;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if(stars >= i){
      html += `<span class="fa fa-star checked"></span>`
    } else if(stars >= i - 0.5){
      html += `<span class="fa fa-star-half-full checked"></span>`
    } else{
      html += `<span class="fa fa-star"></span>`
    }
  }
  return html;
}

function showDetails(movie){
  //console.log(movie);
  const prev = document.getElementById("movieDetails");
  if (prev) prev.remove();
  
  const container = document.createElement("div");
  container.innerHTML = `
    <div class="offcanvas offcanvas-top" tabindex="-1" id="movieDetails">
      <div class="offcanvas-header bg-dark text-white">
        <h5 class="offcanvas-title">${movie.title}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>
      <div class="offcanvas-body bg-dark text-white">
        <p>${movie.overview}</p>
        <p><strong>Géneros:</strong> ${movie.genres.map(g => g.name).join(", ")}</p>

        <div class="dropdown dropend">
          <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown">
            Más información
          </button>
          <ul class="dropdown-menu dropdown-menu-dark">
            <li><span class="dropdown-item">Año: ${movie.release_date.split("-")[0]}</span></li>
            <li><span class="dropdown-item">Duración: ${movie.runtime} min</span></li>
            <li><span class="dropdown-item">Presupuesto: $${movie.budget.toLocaleString()}</span></li>
            <li><span class="dropdown-item">Ganancias: $${movie.revenue.toLocaleString()}</span></li>
          </ul>
        </div>
      </div>
    </div>`;
  document.body.appendChild(container);
  
  const offcanvas = document.getElementById("movieDetails");
  const bsOffcanvas = new bootstrap.Offcanvas(offcanvas);
  bsOffcanvas.show();
};

function filterMovies(search){
    let result = [];
    const container = document.getElementById("lista");
    container.innerHTML = "";

    if(search !== ""){
      result = movies.filter(movie => 
        movie.title.toLowerCase().includes(search) ||
        movie.tagline.toLowerCase().includes(search) ||
        movie.overview.toLowerCase().includes(search) ||
        movie.genres.map(g => g.name.toLowerCase()).join(", ").includes(search)
      );
    };

    result.forEach(movie => {
      container.innerHTML += `<li class="list-group-item bg-dark text-light">
        <div class="d-flex justify-content-between align-items-center">
          <div>
            <h5 class="mb-1">${movie.title}</h5>
            <p class="mb-1 text-muted">${movie.tagline}</p>
          </div>
          <div>${stars(movie.vote_average)}</div>
        </div>
      </li>`;
    });

    let items = container.querySelectorAll("li");
    items.forEach((li, i) => {
      li.addEventListener("click", () => showDetails(result[i]));
    });
};

document.getElementById("btnBuscar").addEventListener("click", () => {
    const search = document.getElementById("inputBuscar").value.trim().toLowerCase();
    filterMovies(search);
});