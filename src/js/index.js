import Search from './models/Search';
import Recipe from './models/Recipe';
import {elements,renderLoader,clearLoader} from './views/base'; 
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
//global state of the app
const state={};

const controlSearch = async ()=>{
    const query = searchView.getInput();
    if(query){
        state.search= new Search(query);


        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);


        await state.search.getResults();

        clearLoader();
        searchView.renderResults(state.search.result);

    }
}

elements.searchForm.addEventListener('submit',e=>{
    e.preventDefault();
    controlSearch();
});



elements.searchResPages.addEventListener('click',e=>{
    const btn = e.target.closest('.btn-inline');
    if(btn){
        const goToPage = parseInt(btn.dataset.goto,10);
        searchView.clearResults();
        searchView.renderResults(state.search.result,goToPage);
    }
});
const controlRecipe = async()=>{
    const id= window.location.hash.replace('#','');
    console.log(id);
    if(id){
        renderLoader(elements.recipe);
        state.recipe = new Recipe(id);
         
        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            clearLoader();
            recipeView.renderRecipe(state.recipe);

        }catch(err){
            alert('error processing recipe');
        }




    }
};
['hashchange','load'].forEach(event=>window.addEventListener(event,controlRecipe));