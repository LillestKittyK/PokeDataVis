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
      const panel = document.querySelector(".panel");

      // Calculate the new height based on the rounded box height
      const newHeight = roundedBox.offsetHeight + 30 + "px";

      // Update the height of the panel
      panel.style.maxHeight = newHeight;

      if (matchedPokemon.length > 0) {

        let listItems = matchedPokemon.slice(0, 8).map(item => {
          const pokemonData = result.find(dataItem => dataItem[1] === item.name.english);
          return `<li><a href="#" data-id="${pokemonData[0]}">${pokemonData[1]}</a></li>`;
        }).join('');

        if (matchedPokemon.length > 8) {
          listItems += '<li>Too many results...</li>';
        }



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
      let prev = false;
      let next = false;
      let prevData;
      let nextData;
      let prevName;
      let nextName;
      let myChart = null;
      let myChartNext = null;
      let myChartPrev = null;
      let entry;
      const displayElement = document.querySelector('#current');
      const prevElement = document.querySelector('#prev');
      const nextElement = document.querySelector('#next');
      displayElement.style.backgroundColor = getColorForType(pokemon.type[0]);
      prevElement.style.backgroundColor = 'white';
      nextElement.style.backgroundColor = 'white';
      prevElement.style.boxShadow = 'none';
      nextElement.style.boxShadow = 'none';
      prevElement.style.border = 'none';
      nextElement.style.border = 'none';
      // set box shadows to none
      prevElement.innerHTML = '';
      nextElement.innerHTML = '';

      let canvasElement = document.getElementById('myChart'); // Get existing canvas element
      if (pokemon.evolution) {
        if (pokemon.evolution.next) {
          next = true;
          console.log(`Next: ${pokemon.evolution.next[0][0]}`);
          // console log that entry of the json with that id
          let id = pokemon.evolution.next[0][0] - 1;
          nextData = data[id];
          // turn id to an integer
          id = parseInt(id);
          console.log(id);
          console.log(data);
          nextName = data[id].name.english;



        }
        if (pokemon.evolution.prev) {
          prev = true;
          console.log(`Prev: ${pokemon.evolution.prev[0]}`);
          let id = pokemon.evolution.prev[0] - 1;
          prevData = data[id];
          id = parseInt(id);
          prevName = data[id].name.english;

        }


      }
      if (pokemon.base) {
        console.log(`'chart created is ${chartCreated}'`)
        chartCreated = 1;

        const typeImages = pokemon.type.map(type => `<img src="images/type_${type}.png" alt="${type}" id="types">`).join('');
        console.log(`prev: ${prevName}`);
        console.log(`next: ${nextName}`);
        displayElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
            <div class="evos">
              ${prev ? `<p>Prev: ${prevName}</p>` : ''}
              ${next ? `<p>Next: ${nextName}</p>` : ''}
            </div>
          </div>
          <div class="type-images">${typeImages}</div>
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

        if (next) {
          console.log(nextData);
          pokemon = nextData;
          nextElement.style.backgroundColor = getColorForType(pokemon.type[0]);
          nextElement.style.boxShadow = "2px 2px 10px #cacaca";
          nextElement.style.border = "1px solid #ccc";
          const typeImages = pokemon.type.map(type => `<img src="images/type_${type}.png" alt="${type}" id="types">`).join('');
          console.log(`prev: ${prevName}`);
          console.log(`next: ${nextName}`);
          nextElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
            
          </div>
          <div class="type-images">${typeImages}</div>
          <img src="${pokemon.image.thumbnail}" alt="">
          <canvas id="myChartNext"></canvas>
        `;
          if (myChartNext) {
            myChartNext.destroy();
          }

          const ctx = document.getElementById('myChartNext').getContext('2d');
          myChartNext = new Chart(ctx, {
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
        if (prev) {
          console.log(prevData);
          pokemon = prevData;
          prevElement.style.backgroundColor = getColorForType(pokemon.type[0]);
          prevElement.style.boxShadow = "2px 2px 10px #cacaca";
          prevElement.style.border = "1px solid #ccc";
          const typeImages = pokemon.type.map(type => `<img src="images/type_${type}.png" alt="${type}" id="types">`).join('');
          console.log(`prev: ${prevName}`);
          console.log(`next: ${nextName}`);
          prevElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
            
          </div>
          <div class="type-images">${typeImages}</div>
          <img src="${pokemon.image.thumbnail}" alt="">
          <canvas id="myChartPrev"></canvas>
        `;
          if (myChartPrev) {
            myChartPrev.destroy();
          }

          const ctx = document.getElementById('myChartPrev').getContext('2d');
          myChartPrev = new Chart(ctx, {
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




        console.log("Code gets to here");

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

function getColorForType(type) {
  switch (type.toLowerCase()) {
    case 'grass':
      return 'rgba(120, 200, 80, 0.5)'; // Green
    case 'fire':
      return 'rgba(240, 128, 48, 0.5)'; // Orange
    case 'water':
      return 'rgba(104, 144, 240, 0.5)'; // Blue
    case 'electric':
      return 'rgba(248, 208, 48, 0.5)'; // Yellow
    case 'bug':
      return 'rgba(168, 184, 32, 0.5)'; // Olive
    case 'normal':
      return 'rgba(168, 168, 120, 0.5)'; // Light Gray
    case 'poison':
      return 'rgba(160, 64, 160, 0.5)'; // Purple
    case 'ground':
      return 'rgba(224, 192, 104, 0.5)'; // Brown
    case 'fairy':
      return 'rgba(238, 153, 172, 0.5)'; // Pink
    case 'fighting':
      return 'rgba(192, 48, 40, 0.5)'; // Red
    case 'psychic':
      return 'rgba(248, 88, 136, 0.5)'; // Pink
    case 'rock':
      return 'rgba(184, 160, 56, 0.5)'; // Gray
    case 'ghost':
      return 'rgba(112, 88, 152, 0.5)'; // Purple
    case 'ice':
      return 'rgba(152, 216, 216, 0.5)'; // Light Blue
    case 'dragon':
      return 'rgba(112, 56, 248, 0.5)'; // Dark Blue
    case 'steel':
      return 'rgba(184, 184, 208, 0.5)'; // Silver
    case 'dark':
      return 'rgba(112, 88, 72, 0.5)'; // Dark Gray
    case 'flying':
      return 'rgba(168, 144, 240, 0.5)'; // Light Blue
    default:
      return 'rgba(0, 0, 0, 0.5)'; // Default color
  }
}

function findPokemonFromJson(id) {
  // fetch pokedex.json
  let entry;
  return fetch('poke/pokedex.json')
    .then(response => response.json())
    .then(data => {

      entry = data[id].name.english;
      return entry;

    })


}

function toggleAccordion(header) {
  const accordion = header.parentElement;
  const panel = accordion.querySelector(".panel");

  if (panel.style.maxHeight) {
    panel.style.maxHeight = null;
    accordion.classList.remove("expanded");
  } else {
    panel.style.maxHeight = panel.scrollHeight + "px";
    accordion.classList.add("expanded");

    // Calculate the new height based on 80% of the viewport height
    const newHeight = Math.floor(window.innerHeight * 0.8) + "px";

    // Update the height of the accordion content
    panel.style.maxHeight = newHeight;
  }
}
