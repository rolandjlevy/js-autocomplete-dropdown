import words from '/words.js';

const input = document.querySelector('#search');
const autocomplete = document.querySelector('#autocomplete');

input.addEventListener('keyup', (e) => {
  if (e.target.value) {
    const found = findWord(e.target.value);
    if (found) autocomplete.classList.remove('hide');
  } else {
    autocomplete.classList.add('hide');
  }
});

function findWord(str) {
  const match = words.filter(item => str === item.substring(0, str.length));
  if (!match.length) return false;
  autocomplete.innerHTML = '';
  const ul = document.createElement('ul');
  match.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item;
    li.addEventListener('click', (e) => {
      search.value = item;
      autocomplete.classList.add('hide');
      autocomplete.innerHTML = '';
    });
    ul.appendChild(li);
  });
  autocomplete.appendChild(ul);
  return true;
}

function findWordReduce(str) {
  const list = words.reduce((acc, item) => {
    if (str === item.substring(0, str.length)) {
      acc += `<li>${item}</li>`;
    }
    return acc;
  }, '');
  return list.length ? `<ul>${list}</ul>` : false;
}