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

  //Function adds pokemon and validates typeof
  function add(pokemon) {
    if (typeof pokemon !== "object") {
      console.log("A pokemon is required");
    }

    let keys = Object.keys(pokemon);
    if (!keys.includes("name")) {
      console.log("Missing Requirements");
    }
    pokemonList.push(pokemon);
  }

  function filterPokemonByName(name) {
    let result = getAll().filter((pokemon) => pokemon.name == name);
    return result[0];   // starting index of 0
  }

  //Return Functions
  return {
    add: add,
    getAll: getAll,
  };
})();


pokemonRepository.getAll().forEach(pokemonList => console.log(pokemonList));


// No longer needed

// for (let i = 0; i < pokemonList.length; i++) {
//   if (pokemonList[i].height < 1.0) {
//     document.write(
//       `${pokemonList[i].name} (height: ${pokemonList[i].height}) - is a small pokemon `
//     );
//   } else {
//     document.write(
//       ` ${pokemonList[i].name} (height ${pokemonList[i].height}) - is a big pokemon! `
//     );
//   }
// }
