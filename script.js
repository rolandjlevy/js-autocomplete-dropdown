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

inputBasic.addEventListener('keyup', (e) => {
  autocompleteBasic.innerHTML = '';
  if (e.target.value) {
    const found = findWordBasic(e.target.value);
    if (found.length) {
      autocompleteBasic.innerHTML = found;
      autocompleteBasic.classList.remove('hide');
    }
  } else {
    autocompleteBasic.classList.add('hide');
  }
});

function findWordBasic(str) {
  const list = words.reduce((acc, item) => {
    if (str === item.substring(0, str.length)) {
      acc += `<li>${item}</li>`;
    }
    return acc;
  }, '');
  return list.length ? `<ul>${list}</ul>` : false;
}

const baseUrl = 'https://api.datamuse.com';
const max = 25;

function fetchWords(search) {
  const url = `${baseUrl}/sug?s=${search}&max=${max}`;
  fetch(url)
  .then(res => res.json())
  .then(list => {
    console.log(list);
  });
}

fetchWords('hay');