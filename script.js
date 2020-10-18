import words from './src/words.js';
import { createElement, getElement, getAllElements } from './src/helpers.js';

const input = getElement('#search');
input.focus();

const autocomplete = getElement('#autocomplete');

let index = 0;

input.addEventListener('keyup', (e) => {
  if (e.target.value) {
    autocomplete.innerHTML = '';
    const found = findWords(e.target.value);
    if (found.length) {
      autocomplete.classList.remove('hide');
      generateDropdown(found);
    }
    if (e.keyCode == 40) {
      index = 1;
      focusItem(index);
    }
  } else {
    autocomplete.classList.add('hide');
  }
});

autocomplete.addEventListener('keydown', (e) => {
  const items = getAllElements('#autocomplete > ul > li');
  if (items.length) {
    switch (e.keyCode) {
      case 38:
        if (index > 1) index--;
        break;
      case 40:
        if (index < items.length) index++;
        break;
    }
    focusItem(index);
  }
});

function focusItem(n) {
  const item = getElement('#autocomplete > ul > li:nth-child(' + n + ')');
  item.addEventListener('keyup', (e) => { 
    if (e.key == 'Enter') resetAutoComplete(e.target.textContent);
  });
  item.focus();
}

function resetAutoComplete(label) {
  search.value = label;
  search.focus();
  autocomplete.classList.add('hide');
  autocomplete.innerHTML = '';
}

const findWords = str => words.filter(item => str === item.substring(0, str.length));

function generateDropdown(items) {
  const ul = createElement('ul');
  items.forEach((item, index) => {
    const li = createElement('li');
    li.textContent = item;
    li.tabIndex = index;
    li.addEventListener('click', (e) => {
      resetAutoComplete(item);
    });
    ul.appendChild(li);
  });
  autocomplete.appendChild(ul);
}

////////////////////
/* words from api */
////////////////////

const inputBasic = getElement('#search-basic');
inputBasic.focus();
const autocompleteBasic = getElement('#autocomplete-basic');
const baseUrl = 'https://api.datamuse.com';
const max = 100;

inputBasic.addEventListener('keyup', (e) => {
  const str = e.target.value.toLowerCase();
  if (str.length > 2) {
    getWords(str).then(list => {
      const found = findMatch(list, str);
      if (found.length) {
        autocompleteBasic.innerHTML = found;
        autocompleteBasic.classList.remove('hide');
        bindClickEvents();
      }
    });
  } else {
    autocompleteBasic.classList.add('hide');
  }
});

function bindClickEvents() {
  const items = getAllElements('#autocomplete-basic > ul > li');
  items.forEach(item => {
    item.addEventListener('click', (e) => {
      inputBasic.value = e.target.textContent;
      autocompleteBasic.classList.add('hide');
    });
  });
}

function getWords(str) {
  return new Promise((resolve, reject) => {
    const url = `${baseUrl}/sug?s=${str}&max=${max}`;
    return fetch(url).then(response => {
      if (response.ok) {
        resolve(response.json())
      } else {
        reject(new Error('error'));
      }
    }, error => {
      reject(new Error(error.message))
    });
  });
}

function findMatch(arr, str) {
  const list = arr.reduce((acc, item) => {
    if (str === item.word.substring(0, str.length)) {
      acc += `<li>${item.word}</li>`;
    }
    return acc;
  }, '');
  return list.length ? `<ul>${list}</ul>` : false;
}

getElement('#youtube-search').addEventListener('click', (e) => {
  window.open(`https://www.youtube.com/results?search_query=${inputBasic.value}`, '_blank');
});

getElement('#google-search').addEventListener('click', (e) => {
  window.open(`https://www.google.com/search?q=${inputBasic.value}`, '_blank');
});

getElement('#wiki-search').addEventListener('click', (e) => {
  window.open(`https://en.wikipedia.org/wiki/${inputBasic.value}`, '_blank');
});


