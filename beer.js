'use strict';

const STORE = {
  zipCode: '90210',
  data: null,
  api_key: '756fb33a58f01bbf36b681f1f6dcffa6',
  BreweryDBurl: 'http://api.brewerydb.com/v2/'
};

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
    <li id={item.id}>
      <a href="#">{item.name}</a>
    </li>
  `;
}

function displayBreweriesFromAPI(store) {
  const data = store.data;
  const results = data.results.map((item) => {
    return renderBreweries(item);
  });
  $('.js-brewery-results').html(results);
}

$('.js-search-form').submit(event => {
  event.preventDefault();
  const queryTarget = $(event.currentTarget).find('.js-input');
  const zipCode = queryTarget.val();
  findBreweriesFromAPI(zipCode, displayBreweriesFromAPI);
  queryTarget.val('');
  $('.js-homepage').attr('hidden', true);
  $('.js-brewery-search-page').removeAttr('hidden');
});