//initialize foundation elements
$(document).foundation();

//declare global variable
var contentEl = document.querySelector("#content");
var watchlistEl = document.querySelector("#watchlist");
var pageContentEl = document.querySelector("#pageContent");
var searchButton = document.querySelector("#search-btn");
var watchlistViewBtn = document.querySelector("#watchlist-view");
var searchViewBtn = document.querySelector("#search-view");
var containerEl = document.querySelector("#content-container");

var currentQuery = '';
var savedToWatchlist = [];

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

  //create URL for fetch with values taken from selector elements
  var netflixQueryUrl = "https://unogsng.p.rapidapi.com/search?country_andorunique=US&audiosubtitle_andor=and&limit=25&subtitle=english&countrylist=78&audio=english&offset=0" + 
    seriesOrMovieQuery + 
    sortByQuery +
    startYearQuery + 
    endYearQuery + 
    startratingQuery + 
    endRatingQuery + 
    genreQuery;

  //pass URL through to function that fetches from API
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
    //save results to global array, render data to page after search
    currentQuery = data;
    renderToPage();
    console.log(data);
  })
  .catch(err => {
    console.log(err);
  });
};

var renderToPage = function() {
  //clear any previous searches
  containerEl.innerHTML = '';

  var contentContainer = document.createElement("div");

  //get length of result array, print each result
  for (var i = 0; i < currentQuery.results.length; i++) {

    var cellContainer = document.createElement("div");
    cellContainer.classList = 'cell';

    var cardBody = document.createElement("div");
    cardBody.classList = 'card';
    cardBody.setAttribute('data-equalizer-watch', '');

    var cardPoster = document.createElement("img");
    cardPoster.setAttribute('src', currentQuery.results[i].poster);
    //if image doesn't load, use jquery from https://css-tricks.com/snippets/jquery/better-broken-image-handling/ to replace with placeholder
    $(cardPoster).on("error", function() {
      $(this).attr('src', './assets/img/300x420.png');
    });

    var cardContent = document.createElement("div");
    cardContent.classList = 'card-section';

    var contentTitle = document.createElement("h4");
    contentTitle.textContent = currentQuery.results[i].title;

    // have to limit the times pulled-too many query's will crash the page 
    if (i < 5) {
    NYTimesReview(currentQuery.results[i].title); 
  }
  
    // stopped at figuring out how to display textContent("See the NY Times Review(s)");
    // for today anyways. >_< *




    //look for instances of &#39; and replace with '
    contentTitle.textContent = contentTitle.textContent.replace('&#39;', "'");

    var contentSynopsis = document.createElement("p");
    contentSynopsis.textContent = currentQuery.results[i].synopsis;
    contentSynopsis.textContent = contentSynopsis.textContent.replace('&#39;', "'");

    cardContent.appendChild(contentTitle);
    cardContent.appendChild(contentSynopsis);

    cardBody.appendChild(cardPoster);
    cardBody.appendChild(cardContent);

    //add netflix ID and result array index as data attributes to button
    var watchlistBtnEl = document.createElement("a");
    watchlistBtnEl.setAttribute('data-nfid', currentQuery.results[i].nfid);
    watchlistBtnEl.setAttribute('data-index', i);
    watchlistBtnEl.classList = 'button expanded watch';

    //function found at following link to check if value is in object in array without for loop https://stackoverflow.com/questions/8217419/how-to-determine-if-javascript-array-contains-an-object-with-an-attribute-that-e
    if (savedToWatchlist.some(e => e.nfid === currentQuery.results[i].nfid)) {
      watchlistBtnEl.textContent = 'Remove from Watchlist';
    }
    else {
      watchlistBtnEl.textContent = 'Add to Watchlist';
    }
    
    cardBody.appendChild(watchlistBtnEl);
    cellContainer.appendChild(cardBody);

    // previously included div in html to begin, caused issue with data equalizer attributes not working and equalizer breaking after add/remove from watchlist, switching views, etc
    // to fix, needed to create the div dynamically, clear innerhtml of parent and render to page on every click or view switch
    contentContainer.setAttribute('id', 'card-container');
    contentContainer.setAttribute('data-equalizer','');
    contentContainer.setAttribute('data-equalize-by-row', true);
    contentContainer.classList = 'grid-x grid-margin-x small-up-1 medium-up-3';
    
    contentContainer.appendChild(cellContainer);
    containerEl.appendChild(contentContainer);
  }
  //must initialize to allow foundation (equalize) to work
  $(document).foundation();
};

var renderToWatchlist = function() {
  var watchlistContainer = document.querySelector("#watchlist-container");
  watchlistContainer.innerHTML = '';

  var watchlistEl = document.createElement("div");

  for (var i = 0; i < savedToWatchlist.length; i++) {

    var cellContainer = document.createElement("div");
    cellContainer.classList = 'cell';

    var cardBody = document.createElement("div");
    cardBody.classList = 'card';
    cardBody.setAttribute('data-equalizer-watch', '');

    var cardPoster = document.createElement("img");
    cardPoster.setAttribute('src', savedToWatchlist[i].poster);
    //if image doesn't load, use jquery from https://css-tricks.com/snippets/jquery/better-broken-image-handling/ to replace with placeholder
    $(cardPoster).on("error", function() {
      $(this).attr('src', './assets/img/300x420.png');
    });

    var cardContent = document.createElement("div");
    cardContent.classList = 'card-section';

    var contentTitle = document.createElement("h4");
    contentTitle.textContent = savedToWatchlist[i].title;
    contentTitle.textContent = contentTitle.textContent.replace('&#39;', "'");

    var contentSynopsis = document.createElement("p");
    contentSynopsis.textContent = savedToWatchlist[i].synopsis;
    contentSynopsis.textContent = contentSynopsis.textContent.replace('&#39;', "'");

    cardContent.appendChild(contentTitle);
    cardContent.appendChild(contentSynopsis);

    cardBody.appendChild(cardPoster);
    cardBody.appendChild(cardContent);

    var watchlistBtnEl = document.createElement("a");
    watchlistBtnEl.classList = 'button expanded watch';
    watchlistBtnEl.textContent = 'Remove from Watchlist';
    watchlistBtnEl.setAttribute('data-nfid', savedToWatchlist[i].nfid);
    watchlistBtnEl.setAttribute('data-index', i);

    cardBody.appendChild(watchlistBtnEl);

    cellContainer.appendChild(cardBody);

    // previously included div in html to begin, caused issue with data equalizer attributes not working and equalizer breaking after add/remove from watchlist, switching views, etc
    // to fix, needed to create the div dynamically, clear innerhtml of parent and render to page on every click or view switch
    watchlistEl.classList = 'grid-x grid-padding-x grid-margin-x small-up-2 large-up-5 medium-up-3 medium-cell-block-y';
    watchlistEl.setAttribute('id', 'watchlist-content');
    watchlistEl.setAttribute('data-equalizer','');
    watchlistEl.setAttribute('data-equalize-by-row', true);
    watchlistEl.appendChild(cellContainer);

    watchlistContainer.appendChild(watchlistEl);
  }
  //must initialize to allow foundation (equalize) to work
  $(document).foundation();
};

//when the search view button is clicked, hide content in watchlist and make sure search content is visible
var contentView = function() {
  searchViewBtn.classList = 'active-button primary button float-center';
  watchlistViewBtn.classList = 'nonactive-button clear button float-center';
  contentEl.classList = 'cell medium-auto medium-cell-block-container';
  watchlistEl.classList = 'cell medium-auto medium-cell-block-container hide';
  renderToPage();
};

//when the watchlist button is clicked, hide content in search view and make sure watchlist is visible
var watchlistView = function() {
  searchViewBtn.classList = 'nonactive-button clear button float-center';
  watchlistViewBtn.classList = 'active-button primary button float-center';
  contentEl.classList = 'cell medium-auto medium-cell-block-container hide';
  watchlistEl.classList = 'cell medium-auto medium-cell-block-container';
  renderToWatchlist();
};

var contentClickHandler = function(event) {
  event.preventDefault();

  //declare variable with target of button click
  var targetEl = event.target;

  //if the button contains the watch class, declare variables for netflix ID and index in search array
  if (targetEl.matches(".watch")) {
    var contentId = targetEl.getAttribute("data-nfid");
    var contentIndex = targetEl.getAttribute("data-index");
 
    var saveToStorage = true;
    var removalIndex;

    //declare var false if array already contains netflix ID for the title
    for (var i = 0; i < savedToWatchlist.length; i++) {
      if (savedToWatchlist[i].nfid === parseInt(contentId)) {
        //if the title is already saved to the watchlist, declare saveToStorage var as false and set removal Index to location in saved array
        saveToStorage = false;
        removalIndex = i;
        break;
      }
    }

    //if save to storage var is true, push the title to the saved to watchlist array, save to localstorage
    if (saveToStorage) {
      savedToWatchlist.push(currentQuery.results[contentIndex]);
      var resultForLocalstorage = JSON.stringify(savedToWatchlist);
      localStorage.setItem('watchlist', resultForLocalstorage);

      //cannot save to storage from watchlist since already in storage, only need to render to page
      renderToPage();
    }

    //if save to storage var is false, find existing title in saved array with splice and value set at removal index, then save updated array to localstorage
    if (!saveToStorage) {
      savedToWatchlist.splice(removalIndex, 1);
      var resultForLocalstorage = JSON.stringify(savedToWatchlist);
      localStorage.setItem('watchlist', resultForLocalstorage);

      //removing from watchlist could be done either from the watchlist or from the search view page, so run both functions
      renderToPage();
      renderToWatchlist();
    }

    //once item has either been saved or removed from watchlist, update text of button accordingly
    if (targetEl.textContent === 'Add to Watchlist') {
      targetEl.textContent = 'Remove from Watchlist';
    }
    else if (targetEl.textContent === 'Remove from Watchlist') {
      targetEl.textContent = 'Add to Watchlist';
    }
  }
};

var loadSavedWatchlist = function() {
  savedToWatchlist = JSON.parse(localStorage.getItem("watchlist"));
  
  //initialize empty array if nothing in localstorage
  if (!savedToWatchlist) {
    savedToWatchlist = [];
  }
};

pageContentEl.addEventListener("click", contentClickHandler);
searchButton.addEventListener("click", createQuery);
searchViewBtn.addEventListener("click", contentView);
watchlistViewBtn.addEventListener("click", watchlistView);

loadSavedWatchlist();

// connection to ny times review search
var NYTimesReview = function(movieName) {
  var NYTQueryUrl = "https://api.nytimes.com/svc/movies/v2/reviews/search.json?query=" + movieName +"&api-key=" + apiKey2;
  fetch(NYTQueryUrl, {
    "method": "GET"
  })
    .then(response => {
      return response.json();
  })
    .then((data) => {
      //save results to global array, render data to page after search
      console.log(data);
  })
    .catch(err => {
      console.log(err);
  });  
}
