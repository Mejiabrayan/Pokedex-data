let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  //Function returns list of pokemon
  function getAll() {
    return pokemonList;
  }

  //Function adds pokemon and validates using typeof
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.log("pokemon is not correct");
    }

    // iterates over keys
    let keys = Object.keys(pokemon);
    if (!keys.includes("name")) {
      document.write("Missing Requirements");
    }
    pokemonList.push(pokemon);
  }

  //  filters through pokemon names
  function filterPokemonByName(name) {
    let result = getAll().filter((pokemon) => pokemon.name == name);
    return result[0]; // starting index of 0
  }

  // Function adds a list of pokemon
  function addListItem(pokemon) {
    let pokemonList = document.querySelector(".pokemon-list");
    let listPokemon = document.createElement("li");
    let button = document.createElement("button");
    button.innerText = pokemon.name;
    button.classList.add("main-button"); //Adds list of classes to button
    listPokemon.appendChild(button);
    pokemonList.appendChild(listPokemon); //Attaches child to pokemon-list container
    // button.addEventListener("click", function () {
    //   showDetails(pokemon);
    // });

    eventListener(button, pokemon)
  }
  // Name it clearer
  function eventListener(button, pokemonItem) {
    button.addEventListener("click", function (event) {
      showDetails(pokemonItem);
    });
  }

  function showDetails(pokemonItem) {
    pokemonRepository.loadDetails(pokemonItem).then(function () {
      console.log(pokemonItem);
    });
  }
  // Fetches data from our API
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach(function (pokemonItem) {
          let pokemon = {
            name: pokemonItem.name,
            detailsUrl: pokemonItem.url,
          };
          add(pokemon);
          console.log(pokemon);
        });
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function loadDetails(pokemonItem) {
    let url = pokemonItem.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        // Details go here
        pokemonItem.imageUrl = details.sprites.front_default;
        pokemonItem.imageUrl = details.sprites.back_default;
        pokemonItem.height = details.height;
        pokemonItem.weight = details.weight;
        pokemonItem.types = details.types;
        pokemonItem.abilities = details.abilities;
        pokemonItem.moves = details.moves;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  //Returns functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    filterPokemonByName: filterPokemonByName,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    eventListener: eventListener,
  };
})();

// Loads the data being fetched

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
// pokemonRepository.getAll().forEach(function (list) {
//   document.write(`Name: ${list.name}, Abilities: ${list.abilities} `);
// });
