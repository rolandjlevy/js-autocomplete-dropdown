import words from '/words.js';

const input = document.querySelector('#search');
const autocomplete = document.querySelector('#autocomplete');
input.focus();
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
  const items = document.querySelectorAll('#autocomplete > ul > li');
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

// autocomplete.addEventListener('scroll', (e) => {
//   // var element = document.getElementById("yourDivID");
//   console.log(111)
//   // autocomplete.scrollTop = autocomplete.scrollHeight;
// });

function focusItem(n) {
  const item = document.querySelector('#autocomplete > ul > li:nth-child(' + n + ')');
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

const findWords = str =>  words.filter(item => str === item.substring(0, str.length));

function generateDropdown(items) {
  const ul = document.createElement('ul');
  items.forEach((item, index) => {
    const li = document.createElement('li');
    li.textContent = item;
    li.tabIndex = index;
    li.addEventListener('click', (e) => {
      resetAutoComplete(item);
    });
    ul.appendChild(li);
  });
  autocomplete.appendChild(ul);
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