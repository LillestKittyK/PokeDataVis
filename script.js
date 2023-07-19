var acc = document.getElementsByClassName("accordion");
const searchContainer = document.querySelector('#content');
const statDistContainer = document.querySelector('.statDistWindow');
const storyContainer = document.querySelector('.storyEvo');


var i;
var currentlyOpen = null;
let chartCreated = 0;
let myChart = null;
let evolveChart = null;

const searchButton = document.querySelector('#searchBtn');
const statDistButton = document.querySelector('#statBtn');
const storyButton = document.querySelector('#storyBtn');

searchButton.addEventListener('click', function (event) {
  searchContainer.style.display = 'flex';
  statDistContainer.style.display = 'none';
  storyContainer.style.display = 'none';
});

statDistButton.addEventListener('click', function (event) {
  searchContainer.style.display = 'none';
  statDistContainer.style.display = 'flex';
  storyContainer.style.display = 'none';
});

storyButton.addEventListener('click', function (event) {
  searchContainer.style.display = 'none';
  statDistContainer.style.display = 'none';
  storyContainer.style.display = 'flex';
});

// create generation charts
fetch('poke/output.json')
  .then(response => response.json())
  .then(data => {
    const charts = [];
    for (let generation = 2; generation <= 7; generation++) {
      const typeColors = {
        'grass': getColorForType('grass'),
        'fire': getColorForType('fire'),
        'water': getColorForType('water'),
        'electric': getColorForType('electric'),
        'bug': getColorForType('bug'),
        'normal': getColorForType('normal'),
        'poison': getColorForType('poison'),
        'ground': getColorForType('ground'),
        'fairy': getColorForType('fairy'),
        'fighting': getColorForType('fighting'),
        'psychic': getColorForType('psychic'),
        'rock': getColorForType('rock'),
        'ghost': getColorForType('ghost'),
        'ice': getColorForType('ice'),
        'dragon': getColorForType('dragon'),
        'steel': getColorForType('steel'),
        'dark': getColorForType('dark'),
        'flying': getColorForType('flying')
      };

      const newData = data.filter(pokemon => pokemon.generation == generation);
      const types = {};
      for (const pokemon of newData) {
        const type1 = pokemon.type1.toLowerCase();
        const type2 = pokemon.type2.toLowerCase();
        console.log(`type 1 is ${type1} and type 2 is ${type2}`);

        if (!types[type1]) {
          types[type1] = 0;
        }
        types[type1] += 1;

        if (type2) {
          if (!types[type2]) {
            types[type2] = 0;
          }
          types[type2] += 1;
        }
      }

      const labels = Object.keys(types);
      const values = Object.values(types);

      const pieChart = {
        type: "polarArea",
        data: {
          labels,
          datasets: [{
            data: values,
            backgroundColor: labels.map(type => `rgba(${typeColors[type]}, 1)`),
            borderColor: "transparent"
          }]
        },
        options: {

          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            
          },

        }
      };
      charts.push(pieChart);
      const canvas1 = document.querySelector(`.gen${generation}types`);
      new Chart(canvas1, pieChart);
      console.log(`made chart ${generation}`);
    }


  });

const buttonsContainer = document.querySelector(".buttons");
const storyBtns = buttonsContainer.querySelectorAll("button");
const gen2types = document.querySelector(".gen2types");
const imgTwo = document.querySelector('#img2');

function clicked(event) {
  const clickedButton = event.target;
  const btnID = clickedButton.id;
  const lastChar = btnID.slice(-1);
  const chartTarget = document.querySelector(`.gen${lastChar}charts`);
  const imgTarget = document.querySelector(`#img${lastChar}`);
  if (btnID.includes('chart')) {
    chartTarget.style.display = 'block';
    imgTarget.style.display = 'none';
  }
  else {
    chartTarget.style.display = 'none';
    imgTarget.style.display = 'block';
  }



}


const accordionButtons = document.querySelectorAll('.accordion');

accordionButtons.forEach(button => {
  button.addEventListener('click', () => {
    accordionButtons.forEach(btn => {
      if (btn === button) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  });
});

const buttons = document.querySelectorAll('button[class*="sel"]');
const divs = document.querySelectorAll('.graphBox');
const selectedPokemonWindow = document.querySelector('.genPokemon');
const genTitle = document.getElementById('genTitle');
const gen = document.getElementById('gen');
const num = document.getElementById('num');

buttons.forEach((button, index) => {
  button.addEventListener('click', async () => {
    const div = divs[index];
    genTitle.style.display = 'block';
    if (div) {
      divs.forEach((otherDiv) => {
        if (otherDiv !== div) {
          otherDiv.classList.remove('selected');
        }
      });

      div.classList.toggle('selected');
      console.log(button);
      // Grab the number at the end of the button ID
      const buttonId = button.className;

      const number = buttonId.slice(-1);
      gen.textContent = `${number}`;
      let genCount;

      switch (parseInt(number)) {
        case 1:
          genCount = 151;
          break;
        case 2:
          genCount = 100;
          break;
        case 3:
          genCount = 135;
          break;
        case 4:
          genCount = 107;
          break;
        case 5:
          genCount = 156;
          break;
        case 6:
          genCount = 72;
          break;
        case 7:
          genCount = 80;
          break;
        default:
          genCount = 0; // Handle unknown generation
          break;
      }

      console.log(genCount);


      const images = await getPokeImages(number);
      // count the number of times the word 'images' appears in the variable images


      num.textContent = `${genCount}`;
      selectedPokemonWindow.innerHTML = `${images}`;
    }
  });
});

async function getPokeImages(generation) {
  let pokeList = [];

  try {
    const response = await fetch('poke/output.json');
    const data = await response.json();

    data.forEach(entry => {
      if (entry.generation == generation) {
        console.log(entry);
        pokeList.push(entry.name);
      }
    });
    console.log(pokeList);

    const response2 = await fetch('poke/pokedex.json');
    const data2 = await response2.json();

    const imgList = pokeList.slice(0, 50).map((pokeName) => {
      const pokeData = data2.find((pokemon) => pokemon.name.english === pokeName);
      const imgSrc = pokeData ? pokeData.image.sprite : '';

      let imgBg = '';
      let type = '';
      if (pokeData && pokeData.type) {
        type = pokeData.type[0]; // Assuming the first type is used
        imgBg = `rgba(${getColorForType(type)}, 0.8)`;
      }

      const entryId = pokeData ? pokeData.id : '';

      return `<img src="${imgSrc}" alt="${pokeName}" title="${pokeName}, ${type}" style="background-color: ${imgBg};" data-entry-id="${entryId}" />`;
    });



    const pokeImagesHTML = imgList.join('\n');
    // console.log(pokeImagesHTML);
    return pokeImagesHTML;
  } catch (error) {
    console.log('Error:', error);
  }
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

        let listItems = matchedPokemon.slice(0, 8).map(item => {
          const pokemonData = result.find(dataItem => dataItem[1] === item.name.english);
          let textColor = getColorForType(data[pokemonData[0] - 1].type[0]);
          console.log(textColor);
          return `<li><a href="#" data-id="${pokemonData[0]}" style='color:black; background-color: rgba(${textColor}, 0.3); border: 1px solid rgb(${textColor})'>${pokemonData[1]}</a></li>`;
        }).join('');

        if (matchedPokemon.length > 8) {
          listItems += '<li id="toomany">Too many results...</li>';
        }



        const numResults = matchedPokemon.length;
        roundedBox.innerHTML = `<p id="numresults">${numResults} result${numResults > 1 ? 's' : ''} found</p><ul>${listItems}</ul>`;

        const links = roundedBox.querySelectorAll('a');
        links.forEach(link => {
          link.addEventListener('click', function (event) {
            event.preventDefault();
            const pokemonId = Number(this.dataset.id);
            const pokemon = data.find(item => item.id === pokemonId);
            
            displayPokemonInfo(pokemon);
          });
        });
      } else {
        roundedBox.innerHTML = 'No pokemon found';
      }
    }

    function displayPokemonInfo(pokemon) {
      console.log(`displaying pokemon: ${pokemon.name.english}`);
      searchButton.classList.add('active');
      storyButton.classList.remove('active');
      statDistButton.classList.remove('active');
      statDistContainer.style.display = 'none';
      searchContainer.style.display = 'flex';
      storyContainer.style.display = 'none';
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
      const currentContainer = document.getElementById('current');
      const particleContainer = document.getElementById('particle-container');

      // figure out if the pokemon is legendary

      let legendary = pokemon.species.includes("Legendary") || pokemon.description.includes("legendary");
      console.log(pokemon.species);
      console.log(`${pokemon.name} is Legendary? ${legendary}`);
      if (legendary) {
        if (!currentContainer.classList.contains('legendary')) {
          currentContainer.classList.add('legendary');
          particleContainer.style.display = 'block';
        }
      }
      else {
        if (currentContainer.classList.contains('legendary')) {
          currentContainer.classList.remove('legendary');
          particleContainer.style.display = 'none';
        }
      }


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
      let bgColor = getColorForType(pokemon.type[0].toLowerCase());
      displayElement.style.backgroundColor = `rgba(${bgColor}, 0.5)`;
      container.style.backgroundColor = `rgba(${bgColor}, 0.1)`;

      iconContainer.innerHTML = `<img src='./images/icon${pokemon.type[0].toLowerCase()}.png'></img>`

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
        lineContainer.style.display = 'block';
        if (pokemon.evolution.next) {
          nextElement.style.display = 'flex';
          prevElement.style.display = 'flex';
          lineContainer.style.display = 'block';
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
          nextElement.style.display = 'flex';
          prevElement.style.display = 'flex';
          lineContainer.style.display = 'block';
          prev = true;
          console.log(`Prev: ${pokemon.evolution.prev[0]}`);
          let id = pokemon.evolution.prev[0] - 1;
          prevData = data[id];
          id = parseInt(id);
          prevName = data[id].name.english;

        }


      }
      if (!prev && !next) {
        lineContainer.style.display = 'none';

      }

      // console.log(`'chart created is ${chartCreated}'`)
      chartCreated = 1;

      const typeImages = pokemon.type.map(type => `<img src="./images/type_${type.toLowerCase()}.png" alt="${type}" id="types">`).join('');
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
            <img src="${pokemon.image.thumbnail}" alt="" id="big-image">
            ${legendary ? `<p id="legendaryTitle">Legendary</p>` : '<p></p>'}  
          </div>
          <canvas id="myChart"></canvas>
          
        `;

      if (pokemon.base) {
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

      if (next) {
        console.log(nextData);
        pokemon = nextData;
        bgColor = getColorForType(pokemon.type[0].toLowerCase());
        nextElement.style.backgroundColor = `rgba(${bgColor}, 0.5)`;
        nextElement.style.boxShadow = "2px 2px 10px #cacaca";
        nextElement.style.border = "1px solid #ccc";
        const typeImages = pokemon.type.map(type => `<img src="./images/type_${type.toLowerCase()}.png" alt="${type}" id="types">`).join('');
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


        if (pokemon.base) {
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
      }
      if (prev) {
        console.log(prevData);
        pokemon = prevData;
        bgColor = getColorForType(pokemon.type[0].toLowerCase());
        prevElement.style.backgroundColor = `rgba(${bgColor}, 0.5)`;
        prevElement.style.boxShadow = "2px 2px 10px #cacaca";
        prevElement.style.border = "1px solid #ccc";
        const typeImages = pokemon.type.map(type => `<img src="./images/type_${type.toLowerCase()}.png" alt="${type}" id="types">`).join('');
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


        if (pokemon.base) {
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
      }

      if (pokemon.base) {
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



    }



  })
  .catch(error => {
    console.error('Error:', error);
  });

fetch('poke/output.json')
  .then(response => response.json())
  .then(data => {
    console.log(data);

    for (let i = 1; i < 8; i++) {
      function countOccurrences(data) {
        const typeCount = {};

        for (const entry of data) {
          if (parseInt(entry.generation) <= i) {

            const type1 = entry.type1;
            const type2 = entry.type2;

            if (type1) {
              typeCount[type1] = (typeCount[type1] || 0) + 1;

            }

            if (type2) {
              typeCount[type2] = (typeCount[type2] || 0) + 1;


            }
          }
        }

        return typeCount;
      }



      let typeCount = countOccurrences(data);
      console.log(typeCount);


      const canvas = document.getElementById(`statGraph${i}`);

      const typeNames = Object.keys(typeCount);
      const typeCounts = Object.values(typeCount);

      const typeColors = {
        'grass': getColorForType('grass'),
        'fire': getColorForType('fire'),
        'water': getColorForType('water'),
        'electric': getColorForType('electric'),
        'bug': getColorForType('bug'),
        'normal': getColorForType('normal'),
        'poison': getColorForType('poison'),
        'ground': getColorForType('ground'),
        'fairy': getColorForType('fairy'),
        'fighting': getColorForType('fighting'),
        'psychic': getColorForType('psychic'),
        'rock': getColorForType('rock'),
        'ghost': getColorForType('ghost'),
        'ice': getColorForType('ice'),
        'dragon': getColorForType('dragon'),
        'steel': getColorForType('steel'),
        'dark': getColorForType('dark'),
        'flying': getColorForType('flying')
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
          responsive: true,
          maintainAspectRatio: false,
          title: {
            display: true,
            text: 'Pokemon Type Distribution'
          },
          legend: {
            display: true,
            position: 'bottom'
          },
          plugins: {
            labels: {
              display: false // Disable the labels
            },
            legend: false
          }
          // Add more customization options as needed
        }
      });
    }

    const canvas = document.querySelector('.lineGenGraph');
    const generationNames = ['Generation 1', 'Generation 2', 'Generation 3', 'Generation 4', 'Generation 5', 'Generation 6', 'Generation 7'];
    const generationCounts = [151, 251, 386, 439, 649, 721, 801];

    const lineChart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: generationNames,
        datasets: [{
          label: 'Number of Pokemon',
          data: generationCounts,
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: 'origin'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        title: {
          display: true,
          text: 'Pokemon Count by Generation'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
        // Add more customization options as needed
      }
    });


  })

function getColorForType(type) {

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




