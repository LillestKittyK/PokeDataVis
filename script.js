var acc = document.getElementsByClassName("accordion");
var i;
var currentlyOpen = null;
let chartCreated = 0;
let myChart = null;

for (i = 0; i < acc.length; i++) {
  acc[i].addEventListener("click", function () {
    if (currentlyOpen && currentlyOpen !== this) {
      currentlyOpen.classList.remove("active");
      currentlyOpen.nextElementSibling.style.maxHeight = null;
    }

    this.classList.toggle("active");
    var panel = this.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }

    currentlyOpen = this.classList.contains("active") ? this : null;
  });
}

const startTime = performance.now();

fetch('poke/pokedex.json')
  .then(response => response.json())
  .then(data => {
    const result = data.map(item => [item.id, item.name.english]);
    console.log(result);
    const endTime = performance.now();
    const executionTime = endTime - startTime;
    console.log(`Execution time: ${executionTime} milliseconds`);

    document.getElementById('search').addEventListener('keyup', searchPokemon);

    function searchPokemon() {
      const searchInput = document.getElementById('search').value.toLowerCase();
      const matchedPokemon = data.filter(item => item.name.english.toLowerCase().includes(searchInput));
      const roundedBox = document.querySelector('.rounded-box');

      if (matchedPokemon.length > 0) {
        const listItems = matchedPokemon.map(item => {
          const pokemonData = result.find(dataItem => dataItem[1] === item.name.english);
          return `<li><a href="#" data-id="${pokemonData[0]}">${pokemonData[1]}</a></li>`;
        }).join('');

        const numResults = matchedPokemon.length;
        roundedBox.innerHTML = `<p>${numResults} result${numResults > 1 ? 's' : ''} found</p><ul>${listItems}</ul>`;

        const links = roundedBox.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('click', function (event) {
            event.preventDefault();
            const pokemonId = Number(this.dataset.id);
            const pokemon = data.find(item => item.id === pokemonId);
            console.log(pokemon);
            displayPokemonInfo(pokemon);
          });
        });
      } else {
        roundedBox.innerHTML = 'No pokemon found';
      }
    }

    function displayPokemonInfo(pokemon) {
      const displayElement = document.querySelector('.display-pokemon');

      let canvasElement = document.getElementById('myChart'); // Get existing canvas element

      if (pokemon.base) {
        console.log(`'chart created is ${chartCreated}'`)
        chartCreated = 1;

        displayElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
          </div>
          
          <img src="${pokemon.image.thumbnail}" alt="">
          <canvas id="myChart"></canvas>
        `;

        if (myChart) {
          myChart.destroy();
        }

        const ctx = document.getElementById('myChart').getContext('2d');
        myChart = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['HP', 'Attack', 'Defense', 'Speed'],
            datasets: [{
              label: pokemon.name.english,
              data: [pokemon.base.HP, pokemon.base.Attack, pokemon.base.Defense, pokemon.base.Speed],
              backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)'],
              borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)'],
              borderWidth: 1
            }]
          },
          options: {
            scales: {
              y: {
                beginAtZero: true
              }
            },
            plugins: {
              afterDraw: function (chart) {
                var ctx = chart.ctx;
                chart.data.datasets.forEach(function (dataset, i) {
                  var meta = chart.getDatasetMeta(i);
                  if (!meta.hidden) {
                    meta.data.forEach(function (element, index) {
                      // Draw the value inside the bar
                      var data = dataset.data[index];
                      ctx.fillStyle = 'black';
                      ctx.font = '12px Open Sans';
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';
                      ctx.fillText(data, element.x, element.y - 10);
                    });
                  }
                });
              }
            }
          }
        });










      }
      else {
        displayElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
          </div>
          <p>No data available</p>
          <img src="${pokemon.image.thumbnail}" alt="">
        `;
      }
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
