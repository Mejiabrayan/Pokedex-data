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

// iterates over each object
for (let i = 0; pokemonList.length < 10; i++) {
  if (pokemonList[i].height < 1.0) {
    document.write(
      `${pokemonList[i].name} (height: ${pokemonList[i].height}) - is a small pokemon `
    );
  } else {
    document.write(
      ` ${pokemonList[i].name} (height ${pokemonList[i].height}) - is a big pokemon! `
    );
  }
}
