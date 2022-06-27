let pokemonRepository = (function () {
  let pokemonList = [
    {
      name: "Bulbasaur",
      height: 0.7,
      weight: "15.2 lbs",
      abilities: ["Chlorophyll", "Overgrow"],
      category: "Seed",
      types: ["Grass", "Poison"],
      weakness: ["Fire", "Pyschic", "Flying", "Ice"],
    },
    {
      name: "Charmander",
      height: 0.6,
      weight: "18.7 lbs",
      abilities: ["Blaze", "Solar-power"],
      category: "Lizard",
      types: ["Fire"],
      weakness: ["Water", "Ground", "Rock"],
    },
    {
      name: "Squirtle",
      height: 0.5,
      weight: "19.8 lbs",
      abilities: ["Rain-dish", "Torrent"],
      category: "Tiny Turtle",
      types: ["Water"],
      weakness: ["Grass", "Electric"],
    },
    {
      name: "Arbok",
      height: "11' 06",
      weight: "123 lbs",
      abilities: ["Shred Skin", "Intimidate"],
      category: "Cobra",
      types: ["Poison"],
      weakness: ["Pyschic", "Ground"],
    },
  ];
  //Function returns list of pokemon
  function getAll() {
    return pokemonList;
  }

  //Function adds pokemon and validates using typeof
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "height" in pokemon &&
      "types" in pokemon
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

    eventListener(button, pokemon);
  }
  // Name it clearer
  function eventListener(button, pokemon) {
    button.addEventListener("click", function () {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    console.log(`This is ${pokemon.name}! and it's type is ${pokemon.types}`);
  }

  //Returns functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    filterPokemonByName: filterPokemonByName,
    showDetails: showDetails,
    eventListener: eventListener,
  };
})();

pokemonRepository.getAll().forEach(function (pokemon) {
  pokemonRepository.addListItem(pokemon);
});

// pokemonRepository.getAll().forEach(function (list) {
//   document.write(`Name: ${list.name}, Abilities: ${list.abilities} `);
// });
