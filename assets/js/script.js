$(document).foundation();

var contentEl = document.querySelector("#content");
var watchlistEl = document.querySelector("#watchlist");
var pageContentEl = document.querySelector("#pageContent");
var searchButton = document.querySelector("#search-btn");
var watchlistViewBtn = document.querySelector("#watchlist-view");
var searchViewBtn = document.querySelector("#search-view");

var currentQuery = '';

var createQuery = function() {
  //clear out contents of previous query
  currentQuery = '';

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

  //get genre and feed in Netflix genre IDs
  var genre = document.querySelector("#genre").value;
  if (genre === 'action') {
    var genreQuery = '&genrelist=90176,77232,43048,1568,43040,10673,1365,801362,7442,2125';
  }
  else if (genre === 'animated') {
    var genreQuery = '&genrelist=7992,9302,2867325,2316199,1819777,7424,4698,11881,2653';
  }
  else if (genre === 'comedy') {
    var genreQuery = '&genrelist=77230,11559,1516534,11039,89585,77599,10375,78163,10778,6548,5286,43040,31694,9434,869,1402,4195';
  }
  else if (genre === 'documentary') {
    var genreQuery = '&genrelist=48768,49547,2595,17672,28269,3652,56178,26126,8673,6839,2243108,10105,9875';
  }
  else if (genre === 'drama') {
    var genreQuery = '&genrelist=11075,3179,3682,52148,56169,29809,89804,384,2150,500,5763,4961,3653,6889,528582748,11,6616,7243,9299,11714';
  }
  else if (genre === 'horror') {
    var genreQuery = '&genrelist=10750,1475312,83059,8711,89585,9509,45028,10944,48303,8195,83059,75804,75405';
  }
  else if (genre === 'romance') {
    var genreQuery = '&genrelist=26156,29281,53915,36103,31273,5475,1255,502675,7153,9916,8883';
  }
  else if (genre === 'scifi') {
    var genreQuery = '&genrelist=852491,1626246,52849,4734,47147,90166,3327,1568,1492,6926,3916,1694,11014,1372';
  }
  else if (genre === 'thriller') {
    var genreQuery = '&genrelist=11014,43048,46588,10499,10306,3269,10504,5505,9147,972,11140,8933';
  }
  else {
    var genreQuery = '';
  }

  var netflixQueryUrl = "https://unogsng.p.rapidapi.com/search?country_andorunique=US&audiosubtitle_andor=and&limit=25&subtitle=english&countrylist=78&audio=english&offset=0" + 
    seriesOrMovieQuery + 
    sortByQuery +
    startYearQuery + 
    endYearQuery + 
    startratingQuery + 
    endRatingQuery + 
    genreQuery;

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
    renderToPage();
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });
};

var renderToPage = function() {
  var containerEl = document.querySelector("#card-container");
  containerEl.innerHTML = '';

  for (var i = 0; i < currentQuery.results.length; i++) {

    var cellContainer = document.createElement("div");
    cellContainer.classList = 'cell';

    var cardBody = document.createElement("div");
    cardBody.classList = 'card';

    var cardPoster = document.createElement("img");
    cardPoster.setAttribute('src', currentQuery.results[i].poster);

    var cardContent = document.createElement("div");
    cardContent.classList = 'card-section';

    var contentTitle = document.createElement("h4");
    contentTitle.textContent = currentQuery.results[i].title;
    contentTitle.textContent = contentTitle.textContent.replace('&#39;', "'");

    var contentSynopsis = document.createElement("p");
    contentSynopsis.textContent = currentQuery.results[i].synopsis;
    contentSynopsis.textContent = contentSynopsis.textContent.replace('&#39;', "'");

    cardContent.appendChild(contentTitle);
    cardContent.appendChild(contentSynopsis);

    cardBody.appendChild(cardPoster);
    cardBody.appendChild(cardContent);

    var watchlistBtnEl = document.createElement("a");
    watchlistBtnEl.classList = 'button expanded watch';
    watchlistBtnEl.textContent = 'Add to Watchlist';
    watchlistBtnEl.setAttribute('data-nfid', currentQuery.results[i].nfid);

    cardBody.appendChild(watchlistBtnEl);

    cellContainer.appendChild(cardBody);

    containerEl.appendChild(cellContainer);
  }
};

var contentView = function() {
  searchViewBtn.classList = 'primary button';
  watchlistViewBtn.classList = 'clear button';
  contentEl.classList = 'cell medium-auto medium-cell-block-container';
  watchlistEl.classList = 'cell medium-auto medium-cell-block-container hide';
};

var watchlistView = function() {
  searchViewBtn.classList = 'clear button';
  watchlistViewBtn.classList = 'primary button';
  contentEl.classList = 'cell medium-auto medium-cell-block-container hide';
  watchlistEl.classList = 'cell medium-auto medium-cell-block-container';
};

var contentClickHandler = function(event) {
  event.preventDefault();

  var targetEl = event.target;

  if (targetEl.matches(".watch")) {
    var contentId = targetEl.getAttribute("data-nfid");
    console.log(contentId);
  }
};

pageContentEl.addEventListener("click", contentClickHandler);
searchButton.addEventListener("click", createQuery);
searchViewBtn.addEventListener("click", contentView);
watchlistViewBtn.addEventListener("click", watchlistView);