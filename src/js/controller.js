// import icons from '../img/icons.svg'; // Parcel 1
import { icons } from 'url:../img/icons.svg'; // Parcel 2

// This polyfills our code to support older browsers
import 'core-js/stable';
// This polyfills async and awaits
import 'regenerator-runtime/runtime';

// MY IMPORTS
import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

if (module.hot) {
  module.hot.accept();
}

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    if (!id) return;
    // Render Spinner
    recipeView.renderSpinner();

    // 0) Update result view to mark selected search result

    resultsView.update(model.getSearchResultsPage());
    
    bookmarksView.update(model.state.bookmarks);
    // LOADING RECIPE
    await model.loadRecipe(id);

    // 2) RENDERING RECIPE
    recipeView.render(model.state.recipe);
  } catch (error) {
    console.log(error)
    recipeView.renderError();
  }
};

const controlSearchResults = async function (event) {
  try {
    event.preventDefault();
    // render spinner
    resultsView.renderSpinner();

    // 1) get search query
    const query = await searchView.getQuery();
    if (!query) return;

    // 2) load search results
    await model.loadSearchResults(query);

    // 3 render search results
    resultsView.render(model.getSearchResultsPage());

    //4 Render initial paginations buttons
    paginationView.render(model.state.search);
  } catch (error) {
    console.log(error);
  }
};

const controlPagination = function (goToPage) {
  // 1 render NEW search results
  resultsView.render(model.getSearchResultsPage(goToPage));

  //2 Render NEW paginations buttons
  paginationView.render(model.state.search);
};

const controlServings = function (newServings) {
  // update the recipe servings (in state)
  model.updateServings(newServings);

  // update the recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookmark = function (){
  // Add or remove bookmark
  if(!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe)
  else if(model.state.recipe.bookmarked) model.deleteBookmark(model.state.recipe.id)
  
  
  // 3 Render bookmarks
  bookmarksView.render(model.state.bookmarks)

  // Update Recipe View
  recipeView.update(model.state.recipe);
}

const controlBookmarks = function(){
  bookmarksView.render(model.state.bookmarks)
}

const controlAddRecipe = async function(newRecipe){
 try{
  // Show loading spinner
  addRecipeView.renderSpinner()
   // Upload recipe data
   await model.uploadRecipe(newRecipe)
   
   // render recipe
   recipeView.render(model.state.recipe);

   // render sucess message
  // addRecipeView.renderMessage()

  // render bookmarview 
  bookmarksView.render(model.state.bookmarks)

  // Change ID in url
  window.history.pushState(null,'',`#${model.state.recipe.id}`)

   // Close form window
   setTimeout(function(){
    addRecipeView.toggleWindow()
   },MODAL_CLOSE_SEC  * 1000)

 }
 catch(error) {
  addRecipeView.renderError(error.message)
 }
}

const newFeature = function (){
  console.log('Welcome to the Application');
  
}

const init = function () {
  // publisher subscriber pattern
  bookmarksView.addHandlerRenderBookmarks(controlBookmarks)
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark)
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
newFeature()
};

init();


/**
 * @todo Display number of pages between the pagination buttons;
 * @todo Ability to sort results by duration or number of ingredients
 * @todo Perform ingredient validation in view, before submitting the form;
 * @todo improve recipe ingedient input : Seperate in multiple fields and allow more than 6 ingredients
 * 
 * 
 * @todo Shopping list feature: button or recipe to add all ingredients to a list
 * @todo weekly meal lanning feature: assign recipes to the next 7 days and show on a weekly calendar
 * @get nutriton data on each ingredient from spoonacular API
 */