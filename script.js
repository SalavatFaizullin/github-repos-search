const searchWrapper = document.querySelector('.search-input');
const input = searchWrapper.querySelector('input');
const dropdownList = searchWrapper.querySelector('.search-input__dropdown-list');
const selectedList = document.querySelector('.selected-list__content');

async function getRepo(evt) {
    if (evt.code === 'Space') { }
    else if (evt.target.value === '') { searchWrapper.classList.remove('active') }
    else {
        return await fetch(`https://api.github.com/search/repositories?q=${evt.target.value}&per_page=5`, {
        })
            .then(response => {
                return response.json();
            })
            .then(object => {
                createDropdownList(object.items);
                createSelectedList();
            })
    }
}

function createDropdownList(array) {
    searchWrapper.classList.add('active');
    dropdownList.innerHTML = '';
    for (let elem of array) {
        let { name, owner: { login }, stargazers_count } = elem;
        dropdownList.insertAdjacentHTML('afterbegin',
            `<li
                    data-name = '${name}'
                    data-owner = '${login}'
                    data-stars = '${stargazers_count}'>
                    ${name}
                </li>`);
    }
}

function createSelectedList() {
    let itemsList = dropdownList.querySelectorAll('li');
    for (let i = 0; i < itemsList.length; i++) {
        itemsList[i].addEventListener('click', () => {
            input.value = '';
            selectedList.insertAdjacentHTML('afterbegin',
                `<li class = 'selected-list__item'>
                        Name: ${itemsList[i].dataset.name}<br>
                        Owner: ${itemsList[i].dataset.owner}<br>
                        Stars: ${itemsList[i].dataset.stars}
                        <button class = 'selected-list__remove-button'>X</button>
                    </li>`);
            searchWrapper.classList.remove('active');
        });
    }
}

function removeItem(evt) {
    if (evt.target.className === 'selected-list__remove-button') {
        evt.target.closest('.selected-list__item').remove();
    }
}

function debounce(fn, debounceTime) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, args);
        }, debounceTime);
    }
}

input.addEventListener('keyup', debounce(getRepo, 400));

selectedList.addEventListener('click', removeItem);
