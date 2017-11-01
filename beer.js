'use strict';

const STORE = {
  zipCode: '90210',
  data: [],
  data2: [],
  api_key: '756fb33a58f01bbf36b681f1f6dcffa6',
  currentIndex: null
};

//get brewery search results
const FIND_BREWERY_BY_ZIP_URL = 'https://api.brewerydb.com/v2/locations/';
function findBreweriesFromAPI(zipcode, callback) {
  let query = {
    key: STORE.api_key,
    postalCode: zipcode
  };
  $.getJSON(FIND_BREWERY_BY_ZIP_URL, query, function(response) {
    STORE.data = response;
    displayBreweriesFromAPI(STORE);
  });
}

function renderBreweries(item) {
  return `
    <li id=${item.brewery.id} class="js-brewery">
      <p>${item.brewery.name}, ${item.streetAddress}, ${item.locality}, ${item.region}</p>
    </li>    
  `;
}

function displayBreweriesFromAPI(store) {
  let results;
  let data = store.data;
  if (data.data) {
    results = data.data.map((item) => {
      return renderBreweries(item);
    });
  } else {
    results = '<p>No breweries found in that zip code!</p>';
  }
  $('.js-brewery-results').html(results);
}

$('.js-search-form').submit(event => {
  event.preventDefault();
  let queryTarget = $(event.currentTarget).find('.js-input');
  const zipCode = queryTarget.val();
  findBreweriesFromAPI(zipCode, displayBreweriesFromAPI);
  queryTarget.val('');
  $('.js-homepage').attr('hidden', true);
  $('.js-brewery-search-page').removeAttr('hidden');
});
//end of get brewery results

//get individual brewery info and beer list
let FIND_BREWERY_BY_ID = 'https://api.brewerydb.com/v2/brewery/';
function findSpecificBrewery(id, callback) {
  FIND_BREWERY_BY_ID += id+'/';
  let query = {
    key: STORE.api_key,
  };
  $.getJSON(FIND_BREWERY_BY_ID, query, function(response) {
    STORE.data = response;
    displayBreweryInfo(STORE);
  });
  FIND_BREWERY_BY_ID = FIND_BREWERY_BY_ID.slice(0, 38);
}

let FIND_BEERLIST_BY_ID = 'https://api.brewerydb.com/v2/brewery/';
function findBeerList(id, callback) {
  FIND_BEERLIST_BY_ID += id+'/beers/';
  let query = {
    key: STORE.api_key,
  };
  $.getJSON(FIND_BEERLIST_BY_ID, query, function(response) {
    STORE.data2 = response;
    displayBeerList(STORE);
  });
  FIND_BEERLIST_BY_ID = FIND_BEERLIST_BY_ID.slice(0, 38);
}

function renderBeer(item) {
  return `
  <li id=${item.id} class="js-beer">
    <p>${item.name}</p>
  </li>    
`;
}

function displayBreweryInfo(store) {
  let data = store.data;
  let results = `
  <h1>${data.data.name}</h1>
  <p>Estbalished in ${data.data.established}</p>
  <img src=${data.data.images.medium}>
  <h3>${data.data.description}</h3>
  <a href="${data.data.website}">${data.data.name} Website</a>
  `;
  $('.js-brewery-info').html(results);
}

function displayBeerList(store) {
  let data2 = store.data2;
  let results2;
  if (data2.data) {
    results2 = data2.data.map((item) => {
      return renderBeer(item);
    });
  } else {
    results2 = '<p>No beer information available!</p>';
  }
  $('.js-beer-list').html(results2);
}

$('.js-brewery-results').on('click', 'p', event => {
  event.preventDefault();
  STORE.currentIndex = $(event.currentTarget).closest('li').index();
  let index = STORE.currentIndex;
  let id = STORE.data.data[index].brewery.id;
  findSpecificBrewery(id, displayBreweryInfo);
  findBeerList(id, displayBeerList);
  $('.js-brewery-search-page').attr('hidden', true);
  $('.js-brewery-page').removeAttr('hidden'); 
});
//end of get individual brewery info and beer list

//get individual beer info
let FIND_BEER_BY_ID = 'https://api.brewerydb.com/v2/beer/';
function findSpecificBeer(id, callback) {
  FIND_BEER_BY_ID += id+'/';
  let query = {
    key: STORE.api_key,
  };
  $.getJSON(FIND_BEER_BY_ID, query, function(response) {
    STORE.data = response;
    displayBeerInfo(STORE);
  });
  FIND_BEER_BY_ID = FIND_BEER_BY_ID.slice(0, 35);
}

function displayBeerInfo(store) {
  let data = store.data;
  let results;
  if (data.data.descrition) {
    results = `
      <h1>${data.data.name}</h1>
      <p>ABV ${data.data.abv}%, IBU ${data.data.ibu}</p>
      <p>Availability: ${data.data.available.description}</p>
      <img src=${data.data.labels.medium}>
      <h3>${data.data.description}</h3>
    `;
  } else {
    results = `
      <h1>${data.data.name}</h1>
      <p>ABV ${data.data.abv}%, IBU ${data.data.ibu}</p>
      <p>Availability: ${data.data.available.description}</p>
      <img src=${data.data.labels.medium}>
    `;
  }
  $('.js-beer-info').html(results);
}

$('.js-beer-list').on('click', 'p', event => {
  event.preventDefault();
  STORE.currentIndex = $(event.currentTarget).closest('li').index();
  let index = STORE.currentIndex;
  let id = STORE.data2.data[index].id;
  findSpecificBeer(id, displayBeerInfo);
  $('.js-brewery-page').attr('hidden', true);
  $('.js-beer-page').removeAttr('hidden'); 
});
//end of get individual beer info

$('.js-go-homepage').click(event => {
  event.preventDefault();
  $('.js-homepage').removeAttr('hidden');
  $('.js-brewery-search-page').attr('hidden', true);
  $('.js-brewery-page').attr('hidden', true);
  $('.js-beer-page').attr('hidden', true);
})