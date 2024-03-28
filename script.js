'use strict';

const countriesContainer = document.querySelector('.countries');
const form = document.querySelector('.country-form');

form.addEventListener('submit', function (e) {
    e.preventDefault();
    
    const countryInput = document.getElementById('country').value;
    
    // Call your function to fetch country details based on user input
    getCountryAndNeighbour(countryInput);
});

const renderCountry = function (data, classname = '') {
    const html = `
    <article class="country ${classname}">
        <img class="country__img" src="${data.flags.png}" />
        <div class="country__data">
            <h3 class="country__name">${data.name.common}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${
                (+data.population / 1000000).toFixed(1) + 'M'
            } people</p>
            <p class="country__row"><span>🗣️</span>${Object.values(data.languages).join(', ')}</p>
            <p class="country__row"><span>💰</span>${data.currencies[Object.keys(data.currencies)[0]].name}</p>
            <button class="btn-remove">Remove</button>
        </div>
    </article>`;

    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;

    // Add event listener for the remove button
    const removeBtn = countriesContainer.querySelector('.btn-remove');
    removeBtn.addEventListener('click', function () {
        // Remove the country element from the DOM
        this.closest('.country').remove();
    });
};

const getCountryAndNeighbour = function (country) {
    const request = new XMLHttpRequest();
    request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
    request.send();
    request.addEventListener('load', function () {
        const [data] = JSON.parse(this.responseText);
        console.log(data);

        renderCountry(data);

        const [neighbour] = data.borders;
        if (!neighbour) return;

        const request2 = new XMLHttpRequest();
        request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`);
        request2.send();
        request2.addEventListener('load', function () {
            console.log(this.responseText);
            const data2 = JSON.parse(this.responseText);
            console.log(data2);
            renderCountry(data2, 'neighbour');
        });
    });
};
