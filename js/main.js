/*===GLOBAL VARIABLES===*/
const sortName = document.querySelector('#sortName');
const sortCapital = document.querySelector('#sortCapital');
const sortPopulation = document.querySelector('#sortPopulation');
const searchInput = document.querySelector('#search-input');
const countriesWrapper = document.querySelector('.countries-wrapper');
const result = document.querySelector('.result');
const buttons = document.querySelector('.buttons');
const topPopulation = document.querySelector('.top-population');
const topLanguages = document.querySelector('.top-languages');

const visualPopulation = document.querySelector('.visual-population');
const totalPopulationHeader = document.querySelector('.total-population');
const topTenCountriesChart = document.querySelector('.population-bar-chart');
const visualLanguages = document.querySelector('.visual-languages');
const totalLanguagesHeader = document.querySelector('.total-languages');
const topTenLanguagesChart = document.querySelector('.languages-bar-chart');

// clear input text
searchInput.addEventListener('focus', function () {
  searchInput.value = "";
});

// Reset Button
const resetButton = (sortby, type) => {
  sortby.classList.remove('active');
  if (sortby.innerHTML.includes('A-Z') || sortby.innerHTML.includes('Z-A')) {
    sortby.innerHTML = `Sort by ${type} A-Z`;
  } else {
    sortby.innerHTML = `Sort by ${type} ↑`;
  }
}

// Reset Chart
const resetChartHTML = () => {
  totalPopulationHeader.innerHTML = '';
  topTenCountriesChart.innerHTML = '';
  totalLanguagesHeader.innerHTML = '';
  topTenLanguagesChart.innerHTML = '';
}

/* Sort Items */
const sortItem = (arr, type) => {
  const copyItem = [...arr];
  const sortedItem = copyItem.sort((a, b) => {
    if (a.type > b.type) return -1;
    if (a.type < b.type) return 1;
  })
  return sortedItem;
}

/* FETCH API ==========================================================================================================*/
const url = 'https://restcountries.eu/rest/v2/all';

const fetchData = async () => {
  try {
    const response = await fetch(url);
    const dataArr = await response.json();

    //change the array object - languages of dataArr to languages array
    dataArr.forEach(country => {
      const arrayLanguages = country.languages.map(language => {
        return language.name
      })
      // replace object with array
      country.languages = arrayLanguages;
    })

    return dataArr;
  } catch (error) {
    console.log(error)
  }
}

(async () => {
  const data = await fetchData();

  // numbers of countries UI
  result.textContent = `${data.length}`;

  // Copy the array
  let copyCountries = [...data];

  const sortData = searchKey => {
    let data;
    // Decide data to sort
    if (searchKey !== '') {
      data = filterCountries(copyCountries, searchKey);
    } else {
      data = copyCountries;
    }
    return data;
  }

  // Sort an array
  // sortedArr(arr, true / false, name/capital/population)
  const sortedArr = (arr, descending, type) => {
    //check descending or ascending
    const mode = descending ? 1 : -1;

    arr.sort((a, b) => {
      if (a[type] < b[type]) {
        return 1 * mode;
      } else if (a[type] > b[type]) {
        return -1 * mode;
      }
    })
  }

  // Buttons Add Event Listener:
  sortName.addEventListener('click', e => {
    resetButton(sortCapital, `Capital`);
    resetButton(sortPopulation, `Population`);
    let searchTerm = searchInput.value.toLowerCase();
    const newData = sortData(searchTerm);
    // sort data & change value of current button
    if (sortName.classList.contains('active') && sortName.innerHTML == 'Sort by Name A-Z') {
      sortedArr(newData, true, 'name');
      sortName.innerHTML = 'Sort by Name Z-A';
    } else {
      sortName.classList.add('active');
      sortedArr(newData, false, 'name');
      sortName.innerHTML = 'Sort by Name A-Z';
    }
    showCountries(newData);
    result.textContent = `${newData.length}`;
  });

  sortCapital.addEventListener('click', function () {
    resetButton(sortName, 'Name');
    resetButton(sortPopulation, 'Population');
    let searchTerm = searchInput.value.toLowerCase();
    const newData = sortData(searchTerm);
    // sort data & change value of current button
    if (sortCapital.classList.contains('active') && sortCapital.innerHTML == 'Sort by Capital A-Z') {
      sortedArr(newData, true, 'capital');
      sortCapital.innerHTML = 'Sort by Capital Z-A';
    } else {
      sortCapital.classList.add('active');
      sortedArr(newData, false, 'capital');
      sortCapital.innerHTML = 'Sort by Capital A-Z';
    }
    showCountries(newData);
    result.textContent = `${newData.length}`;
  });

  sortPopulation.addEventListener('click', function () {
    resetButton(sortName, 'Name');
    resetButton(sortCapital, 'Capital');

    let searchTerm = searchInput.value.toLowerCase();
    const newData = sortData(searchTerm);
    // sort data & change value of current button
    if (sortPopulation.classList.contains('active') && sortPopulation.innerHTML == 'Sort by Population ↑') {
      sortedArr(newData, true, 'population');
      sortPopulation.innerHTML = 'Sort by Population ↓';
    } else {
      sortPopulation.classList.add('active');
      sortedArr(newData, false, 'population');
      sortPopulation.innerHTML = 'Sort by Population ↑';
    }
    showCountries(newData);
    result.textContent = `${newData.length}`;
  });

  /* TOP 10 Population================================================================================================*/

  const totalPopulation = copyCountries.reduce((accumulate, {
    population
  }) => {
    return accumulate += population;
  }, 0); // 0 is the 1st sum.


  function populationChartResult() {

    visualLanguages.style.display = 'none';
    resetChartHTML();
    let searchTerm = searchInput.value.toLowerCase();
    const arr = filterCountries(copyCountries, searchTerm);

    sortedArr(arr, true, 'population');
    const topTenCountriesPopulation = arr.slice(0, 10);

    /*Total UI */
    totalPopulationHeader.insertAdjacentHTML('afterbegin',
      `
    <div class="total-title">World population:</div>
    <div class="bar-box">
      <div class="bar-total">${totalPopulation.toLocaleString()}</div>
    </div>
    `
    );

    topTenCountriesPopulation.forEach(({
      name,
      population
    }) => {
      const percentage = (population * 100) / totalPopulation;
      topTenCountriesChart.insertAdjacentHTML(
        'beforeend',
        `
      <div class="bar-container">
        <p>${name}</p>
        <div class="bar-box">
          <div class="bar" style="width: ${percentage}%; background-color: #4eb5e5">
            ${population.toLocaleString()}
          </div>
        </div>
      </div>
      `
      );
    });

  }
  topPopulation.addEventListener('click', function () {
    if (visualPopulation.style.display == 'block') {
      visualPopulation.style.display = 'none';
      topPopulation.classList.remove('active');
    } else {
      visualPopulation.style.display = 'block';
      topPopulation.classList.add('active');
      topLanguages.classList.remove('active');
    }
    populationChartResult();
  });

  /* Top 10 Languages ===============================================================================================*/

  const mapLanguages = copyCountries => {
    const map = new Map();
    copyCountries.forEach(country => {
      country.languages.forEach(language => {
        if (map.has(language)) {
          map.set(language, map.get(language) + 1);
        } else {
          map.set(language, 1);
        }
      })
    });
    // change to array using Array.from()
    return Array.from(map);
  };

  const totalLanguages = mapLanguages(copyCountries).length;

  function languagesChartResult() {
    resetChartHTML();
    visualPopulation.style.display = 'none';

    totalLanguagesHeader.insertAdjacentHTML('afterbegin',
      `
        <div class="total-title">World languages:</div>
        <div class="bar-box">
        <div class="bar-total">${totalLanguages}</div>
        </div>
        `
    );

    let searchTerm = searchInput.value.toLowerCase();
    const arr = filterCountries(copyCountries, searchTerm);
    console.log(arr);
    

    const topTenLanguages = mapLanguages(arr).sort(function (a, b) {
      if (a[1] > b[1]) {
        return -1;
      }
    }).slice(0, 10);

    topTenLanguages.forEach(([name, num]) => {
      const percentage = ((num * 100) / totalLanguages);
      topTenLanguagesChart.insertAdjacentHTML(
        'beforeend',
        `
      <div class="bar-container">
        <p>${name}</p>
        <div class="bar-box">
          <div class="bar" style="width: ${percentage}%; background-color: #4eb5e5">
            ${num}
          </div>
        </div>
      </div>
      `
      );
    })
  }

  topLanguages.addEventListener('click', function () {
    if (visualLanguages.style.display == 'block') {
      visualLanguages.style.display = 'none';
      topLanguages.classList.remove('active');
    } else {
      visualLanguages.style.display = 'block';
      topLanguages.classList.add('active');
      topPopulation.classList.remove('active');
    }
    languagesChartResult();
  });


  /* FILTER FUNCTION==================================================================================================*/
  const filterCountries = (arr, search) => {
    // let {name, capital, languages} = country => shorter version:
    const filteredCountries = arr.filter(({
      name,
      capital,
      languages
    }) => {
      let isName = name.toLowerCase().includes(search);
      let isCapital = capital.toLowerCase().includes(search);
      let isLanguages = languages.join().toLowerCase().includes(search);
      return isName || isCapital || isLanguages;
    });
    let result = search == '' ? arr : filteredCountries;
    return result;
  };

  searchInput.addEventListener('click', e => {
    sortName.classList.remove('active');
    sortCapital.classList.remove('active');
    sortPopulation.classList.remove('active');
    topPopulation.classList.remove('active');
    topLanguages.classList.remove('active');
    let searchTerm = e.target.value.toLowerCase();
    showCountries(filterCountries(copyCountries, searchTerm));
    result.textContent = `${copyCountries.length}`;
  })

  /* Create the countries wrapper content =========================================================================== */
  const createContent = content => {
    const {
      name,
      capital,
      languages,
      population,
      flag
    } = content;

    return `<div>
  <img class="image" src="${flag}"/>
  <p class="name">${name}</p>
  <p>${capital}</p>
  <p><em class="languages">${languages.join(', ')}</em></p>
  <p>${population.toLocaleString()}</p>
</div>`
  }; // toLocaleString() - for language-sensitive

  /* Show the countries in the UI =================================================================================== */
  const showCountries = arr => {
    countriesWrapper.innerHTML = "";
    let contents = '';
    arr.forEach((country, i) => {
      contents += createContent(country);
    });
    countriesWrapper.innerHTML = contents;
  };

  showCountries(filterCountries(data, searchInput.value));

  /* Event listener to get search input ============================================================================= */
  searchInput.addEventListener('input', e => {
    let searchTerm = e.target.value.toLowerCase();
    showCountries(filterCountries(data, searchTerm));
    let newCountries = filterCountries(data, searchTerm);
    result.textContent = `${newCountries.length}`;
    populationChartResult();
    languagesChartResult();
  });

})();

// fetch(url)
//   .then(response => response.json())
//   .then(arr => {
//     console.log(arr);

//     arr.map(element => data.push(element))
//     console.log(data);
//     return data;

//   })
//   .catch(error => console.log(error));