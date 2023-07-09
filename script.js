var acc = document.getElementsByClassName("accordion");
const searchContainer = document.querySelector('#content');
const statDistContainer = document.querySelector('.statDistWindow');


var i;
var currentlyOpen = null;
let chartCreated = 0;
let myChart = null;
let evolveChart = null;

const searchButton = document.querySelector('#searchBtn');
const statDistButton = document.querySelector('#statBtn');

searchButton.addEventListener('click', function (event) {
  searchContainer.style.display = 'flex';
  statDistContainer.style.display = 'none';
});

statDistButton.addEventListener('click', function (event) {
  searchContainer.style.display = 'none';
  statDistContainer.style.display = 'flex';
});



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

    function countOccurrences() {

      const typeCount = {};

      for (const entry of data) {
        for (const type of entry.type) {
          typeCount[type] = (typeCount[type] || 0) + 1;
        }
      }


      return typeCount;

    }

    let typeCount = countOccurrences();
    const canvas = document.getElementById('statGraph');
    const typeNames = Object.keys(typeCount);
    const typeCounts = Object.values(typeCount);

    const typeColors = {
      'Grass': getColorForType('grass'),
      'Fire': getColorForType('fire'),
      'Water': getColorForType('water'),
      'Electric': getColorForType('electric'),
      'Bug': getColorForType('bug'),
      'Normal': getColorForType('normal'),
      'Poison': getColorForType('poison'),
      'Ground': getColorForType('ground'),
      'Fairy': getColorForType('fairy'),
      'Fighting': getColorForType('fighting'),
      'Psychic': getColorForType('psychic'),
      'Rock': getColorForType('rock'),
      'Ghost': getColorForType('ghost'),
      'Ice': getColorForType('ice'),
      'Dragon': getColorForType('dragon'),
      'Steel': getColorForType('steel'),
      'Dark': getColorForType('dark'),
      'Flying': getColorForType('flying')
    };
    console.log(typeColors);

    const pieChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: typeNames,
        datasets: [{
          data: typeCounts,
          backgroundColor: typeNames.map(type => `rgba(${typeColors[type]}, 0.6)`)

        }]
      },
      options: {
        // Customize chart options as needed
      }
    });

    

    canvas.addEventListener('click', handleClick);

   

    function handleClick(event) {
      
      const selectedPokemonWindow = document.querySelector('.selectedPokemon');
      const points = pieChart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true);

      if (points.length) {
        const firstPoint = points[0];
        const selectedIndex = firstPoint.index;
        const selectedType = typeNames[selectedIndex];
        console.log(selectedType);
        const selectedPokemon = getPokemonByType(selectedType);
        const selectedBGColor = getColorForType(selectedType);
        const selectedSprites = selectedPokemon.slice(0, 39).map(pokemon => {
          const imgElement = document.createElement('img');
          imgElement.src = pokemon.image.sprite;
          imgElement.alt = pokemon.name.english;
          imgElement.title = pokemon.name.english;
          imgElement.style.width = '37px';
          imgElement.addEventListener('click', (function(pokemonName) {
            return function() {
              displayPokemonInfo(pokemonName);
            };
          })(pokemon.name.english));
          return imgElement.outerHTML;
        });
        selectedPokemonWindow.innerHTML = selectedSprites.join(' ');
        selectedPokemonWindow.style.backgroundColor = `rgba(${selectedBGColor},0.2)`
        selectedPokemonWindow.style.boxShadow = `0px 0px 10px rgba(${selectedBGColor},0.8)`
        

      
      }
    }

    function clickedPokemon(pokemon) {
      displayPokemonInfo(pokemon);
    }

    function getPokemonByType(type) {
      return data.filter(item => item.type.includes(type));
    }

    function searchPokemon() {
      const searchInput = document.getElementById('search').value.toLowerCase();
      const matchedPokemon = data.filter(item => item.name.english.toLowerCase().includes(searchInput));
      const roundedBox = document.querySelector('.rounded-box');
      const panel = document.querySelector(".panel");

      // Calculate the new height based on the rounded box height


      if (matchedPokemon.length > 0) {

        let listItems = matchedPokemon.slice(0, 10).map(item => {
          const pokemonData = result.find(dataItem => dataItem[1] === item.name.english);
          let textColor = getColorForType(data[pokemonData[0] - 1].type[0]);
          console.log(textColor);
          return `<li><a href="#" data-id="${pokemonData[0]}" style='color:rgb(${(textColor)}); background-color: rgba(${textColor}, 0.1); border: 1px solid rgb(${textColor})'>${pokemonData[1]}</a></li>`;
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
      console.log(`displaying pokemon: ${pokemon.name.english}`);
      statDistContainer.style.display = 'none';
      searchContainer.style.display = 'flex';
      let prev = false;
      let next = false;
      let prevData;
      let nextData;
      let currentData;
      currentData = pokemon;
      let prevName;
      let nextName;
      let myChart = null;
      let myChartNext = null;
      let myChartPrev = null;

      let prevStats;
      let nextStats;
      let entry;
      const displayElement = document.querySelector('#current');
      const evolveChartElement = document.querySelector('#evolution');
      const prevElement = document.querySelector('#prev');
      const nextElement = document.querySelector('#next');
      const container = document.querySelector('#content');

      const iconContainer = document.querySelector('.icon');
      const lineContainer = document.querySelector('.lineContainer');
      let bgColor = getColorForType(pokemon.type[0]);
      displayElement.style.backgroundColor = `rgba(${bgColor}, 0.5)`;
      container.style.backgroundColor = `rgba(${bgColor}, 0.1)`;

      iconContainer.innerHTML = `<img src='images/icon${pokemon.type[0]}.png'></img>`

      prevElement.style.backgroundColor = 'transparent';
      nextElement.style.backgroundColor = 'transparent';
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
          <div class="images">
            <div class="type-images">${typeImages}</div>
            <img src="${pokemon.image.thumbnail}" alt="">
          </div>
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
          bgColor = getColorForType(pokemon.type[0]);
          nextElement.style.backgroundColor = `rgba(${bgColor}, 0.5)`;
          nextElement.style.boxShadow = "2px 2px 10px #cacaca";
          nextElement.style.border = "1px solid #ccc";
          const typeImages = pokemon.type.map(type => `<img src="images/type_${type}.png" alt="${type}" id="types">`).join('');
          console.log(`prev: ${prevName}`);
          console.log(`next: ${nextName}`);
          nextElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
            
          </div>
          <div class="images">
            <div class="type-images">${typeImages}</div>
            <img src="${pokemon.image.thumbnail}" alt="">
          </div>
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
          bgColor = getColorForType(pokemon.type[0]);
          prevElement.style.backgroundColor = `rgba(${bgColor}, 0.5)`;
          prevElement.style.boxShadow = "2px 2px 10px #cacaca";
          prevElement.style.border = "1px solid #ccc";
          const typeImages = pokemon.type.map(type => `<img src="images/type_${type}.png" alt="${type}" id="types">`).join('');
          console.log(`prev: ${prevName}`);
          console.log(`next: ${nextName}`);
          prevElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
            
          </div>
          <div class="images">
            <div class="type-images">${typeImages}</div>
            <img src="${pokemon.image.thumbnail}" alt="">
          </div>
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

        console.log(prevData);
        if (prevData) { prevStats = [prevData.base.HP, prevData.base.Attack, prevData.base.Defense, prevData.base.Speed]; }
        let currentStats = [currentData.base.HP, currentData.base.Attack, currentData.base.Defense, currentData.base.Speed];
        if (nextData) { nextStats = [nextData.base.HP, nextData.base.Attack, nextData.base.Defense, nextData.base.Speed]; }
        console.log(prevStats);
        console.log(currentStats);
        console.log(nextStats);


        const chartData = {
          labels: ['Current Evolution'],
          datasets: [
            {
              label: 'HP',
              data: [currentStats[0]],
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 0.2)',
            },
            {
              label: 'Attack',
              data: [currentStats[1]],
              borderColor: 'rgba(54, 162, 235, 1)',
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
            },
            {
              label: 'Defense',
              data: [currentStats[2]],
              borderColor: 'rgba(255, 206, 86, 1)',
              backgroundColor: 'rgba(255, 206, 86, 0.2)',
            },
            {
              label: 'Speed',
              data: [currentStats[3]],
              borderColor: 'rgba(75, 192, 192, 1)',
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
            },
          ],
        };

        if (prevStats) {
          chartData.labels.unshift('Previous Evolution');
          for (let i = 0; i < chartData.datasets.length; i++) {
            chartData.datasets[i].data.unshift(prevStats[i]);
          }
        }

        if (nextStats) {
          chartData.labels.push('Next Evolution');
          for (let i = 0; i < chartData.datasets.length; i++) {
            chartData.datasets[i].data.push(nextStats[i]);
          }
        }


        console.log(chartData);
        if (prevStats || nextStats) {

          if (evolveChart) {
            console.log("Destroying chart");
            evolveChart.destroy();


          }



          const ctxEvolve = evolveChartElement.getContext('2d');

          evolveChart = new Chart(ctxEvolve, {
            type: 'line',
            data: chartData,
            options: {

              responsive: true, // Enable responsiveness to fit within the container
              plugins: {
                legend: {
                  display: true, // Adjust legend display as needed
                  position: 'top', // Position the legend at the top or other desired position
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  maxTicksLimit: 5, // Adjust the number of ticks on the y-axis as needed
                },
              },
            },
          });
        }
        else {
          const ctxEvolve = evolveChartElement.getContext('2d');
          ctxEvolve.clearRect(0, 0, evolveChartElement.width, evolveChartElement.height);
        }
        console.log("Code gets to here");

      }
      else {
        const typeImages = pokemon.type.map(type => `<img src="images/type_${type}.png" alt="${type}" id="types">`).join('');
        displayElement.innerHTML = `
          <div class="display-header">
            <h3>${pokemon.name.english}</h3>
          </div>
          <div class="images">
            <div class="type-images">${typeImages}</div>
            <img src="${pokemon.image.thumbnail}" alt="">
            
          </div>
        `;
      }
    }

    

  })
  .catch(error => {
    console.error('Error:', error);
  });

function getColorForType(type) {
  console.log(type);
  switch (type.toLowerCase()) {
    case 'grass':
      return '120, 200, 80'; // Green
    case 'fire':
      return '240, 128, 48'; // Orange
    case 'water':
      return '104, 144, 240'; // Blue
    case 'electric':
      return '248, 208, 48'; // Yellow
    case 'bug':
      return '168, 184, 32'; // Olive
    case 'normal':
      return '168, 168, 120'; // Light Gray
    case 'poison':
      return '160, 64, 160'; // Purple
    case 'ground':
      return '224, 192, 104'; // Brown
    case 'fairy':
      return '238, 153, 172'; // Pink
    case 'fighting':
      return '192, 48, 40'; // Red
    case 'psychic':
      return '248, 88, 136'; // Pink
    case 'rock':
      return '184, 160, 56'; // Gray
    case 'ghost':
      return '112, 88, 152'; // Purple
    case 'ice':
      return '152, 216, 216'; // Light Blue
    case 'dragon':
      return '112, 56, 248'; // Dark Blue
    case 'steel':
      return '184, 184, 208'; // Silver
    case 'dark':
      return '112, 88, 72'; // Dark Gray
    case 'flying':
      return '168, 144, 240'; // Light Blue
    default:
      return '0, 0, 0'; // Default color
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


