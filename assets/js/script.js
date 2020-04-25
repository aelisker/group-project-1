$(document).foundation();

var currentQuery = '';

var createQuery = function() {
  //get value of movie or series, if both, do not pass in any value per API doc
  var seriesOrMovie = document.querySelector("#movieOrSeries").value;
  if (seriesOrMovie === 'both') {
    var seriesOrMovieQuery = ''
  }
  else {
    var seriesOrMovieQuery = '&type=' + seriesOrMovie;
  }

  //year start and end value from range slider
  var startYear = document.querySelector("#yearStart").value;
  var startYearQuery = '&start_year=' + startYear;

  var endYear = document.querySelector("#yearEnd").value;
  var endYearQuery = '&end_year=' + endYear;

  //imdb rating start and end value from range slider
  var startRating = document.querySelector("#ratingStart").value;
  var startratingQuery = '&start_rating=' + startRating;

  var endRating = document.querySelector("#ratingEnd").value;
  var endRatingQuery = '&end_rating=' + endRating;

  //sort by value from dropdown
  var sortBy = document.querySelector("#sort").value;
  var sortByQuery = '&orderby=' + sortBy;

  var netflixQueryUrl = "https://unogsng.p.rapidapi.com/search?country_andorunique=US&audiosubtitle_andor=and&limit=25&subtitle=english&countrylist=78&audio=english&offset=0" + 
    seriesOrMovieQuery + 
    sortByQuery +
    startYearQuery + 
    endYearQuery + 
    startratingQuery + 
    endRatingQuery;

  netflixQuery(netflixQueryUrl);
};

var netflixQuery = function(queryUrl) {
  fetch(queryUrl, {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "unogsng.p.rapidapi.com",
		"x-rapidapi-key": apiKey
	} 
  })
  .then(response => {
    console.log(response);
    return response.json();
  })
  .then((data) => {
    currentQuery = data;
    // renderToPage();
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });
};

var renderToPage = function() {
  var carouselEl = document.querySelector("#contentCarousel");
  for (var i = 0; i < currentQuery.results.length; i++) {

    var carouselImg = document.createElement("img");
    var carouselItem = document.createElement("a");

    carouselItem.className = 'carousel-item';
    carouselItem.setAttribute('href', 'https://www.google.com');

    carouselImg.setAttribute('src', currentQuery.results[i].poster);

    carouselItem.appendChild(carouselImg);
    carouselEl.appendChild(carouselItem);
  }
};

var contentView = function() {
  var contentEl = document.querySelector("#content");
  var watchlistEl = document.querySelector("#watchlist");

  searchViewBtn.classList = 'primary button';
  watchlistViewBtn.classList = 'clear button';
  contentEl.classList = 'cell medium-auto medium-cell-block-container';
  watchlistEl.classList = 'cell medium-auto medium-cell-block-container hide';
};

var watchlistView = function() {
  var contentEl = document.querySelector("#content");
  var watchlistEl = document.querySelector("#watchlist");

  searchViewBtn.classList = 'clear button';
  watchlistViewBtn.classList = 'primary button';
  contentEl.classList = 'cell medium-auto medium-cell-block-container hide';
  watchlistEl.classList = 'cell medium-auto medium-cell-block-container';
};

var searchButton = document.querySelector("#search-btn");
searchButton.addEventListener("click", createQuery);

var searchViewBtn = document.querySelector("#search-view");
searchViewBtn.addEventListener("click", contentView);

var watchlistViewBtn = document.querySelector("#watchlist-view");
watchlistViewBtn.addEventListener("click", watchlistView);