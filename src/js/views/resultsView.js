import View from "./View";
import previewView from './previewView';
import {icons} from 'url:../../img/icons.svg';

class ResultsView extends View{
_parentElement = document.querySelector('.results')
_errorMessage = 'No recipes  found for your query! Please try another query'

_generateMarkup() {
  return this._data
    .map(bookmark => previewView.render(bookmark, false))
    .join();
}
_generateMarkupPreview(result){
  const id = window.location.hash.slice(1)
  return `
<li class="preview">
<a class="preview__link ${result.id === id ?'preview__link--active': ''}" href="#${result.id}">
  <figure class="preview__fig">
    <img src="${result.image}" alt="${result.title} image" />
  </figure>
  <div class="preview__data">
    <h4 class="preview__title">${result.title > 13 ? result.slice(0,14)+"...": result.title}</h4>
    <p class="preview__publisher">${result.publisher}</p>
    
  </div>
</a>
</li>
`
}
}

export default new ResultsView()