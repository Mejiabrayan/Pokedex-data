let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";
  let modalContainer = document.querySelector("#modal-container");

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
    // let keys = Object.keys(pokemon);
    // if (!keys.includes("name")) {
    //   document.write("Missing Requirements");
    // }
    // pokemonList.push(pokemon);
  }

  //  filters through pokemon names
  function search(pokemonName) {
    return pokemonList.filter((pokemon) => pokemon.name === pokemonName);
  }

  // Function adds a list of pokemon
  function addListItem(pokemon) {
    let pokemonDisplay = document.querySelector(".pokemon-list");
    let listItem = document.createElement("li");
    let listButton = document.createElement("button");
    listButton.innerHTML = `<strong> ${pokemon.name}</strong>`;
    listButton.classList.add("selected-button"); //Adds list of classes to button
    listItem.appendChild(listButton);
    pokemonDisplay.appendChild(listItem); //Attaches child to pokemon-list container

    buttonEvent(listButton, pokemon);
  }
  // Name it clearer
  function buttonEvent(listButton, pokemon) {
    listButton.addEventListener("click", () => {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      // We set our existing modal-container to empty
      modalContainer.innerHTML = "";

      modalContainer.classList.add("is-visible");

      // create our modal-div with a class of modal
      let modal = document.createElement("div");
      modal.classList.add("modal");

      // close button
      let closeButton = document.createElement("button");
      closeButton.classList.add("modal-close");
      closeButton.innerText = "X";
      closeButton.setAttribute("title", "close");
      closeButton.addEventListener("click", hideDetails);

      // Modal title
      let modalTitle = document.createElement("h1");
      modalTitle.innerText = pokemon.name;

      // Modal content

      let entryElement = document.createElement("p");
      entryElement.innerText = `Entry: ${pokemon.id}`;

      let heightElement = document.createElement("p");
      heightElement.innerText = `Height: ${pokemon.height}`;

      let weightElement = document.createElement("p");
      weightElement.innerText = `Weight: ${pokemon.weight}`;

      let abilitiesElement = document.createElement("p");
      abilitiesElement.innerText = `Abilities: ${pokemon.abilities[0].ability.name}`;

      let typesElement = document.createElement("p");
      typesElement.innerText = `Types: ${pokemon.types[0].type.name}`;

      if (pokemon.types.length === 2) {
        typesElement.innerText += `, ${pokemon.types[1].type.name}`;
      }
      // creating an element to hold our image
      let imageElement = document.createElement("img");
      imageElement.src = pokemon.imageUrl;

      // appending all elements to our modal-div
      modal.appendChild(closeButton);
      modal.appendChild(modalTitle);
      modal.appendChild(heightElement);
      modal.appendChild(weightElement);
      modal.appendChild(abilitiesElement);
      modal.appendChild(typesElement);
      modal.appendChild(imageElement);
      modal.appendChild(entryElement);
      modalContainer.appendChild(modal);
    });
  }

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalContainer.classList.contains("is-visible")) {
      hideDetails();
    }
  });

  modalContainer.addEventListener("click", (e) => {
    let target = e.target;
    if (target === modalContainer) {
      hideDetails();
    }
  });

  function hideDetails() {
    modalContainer.classList.remove("is-visible");
  }

  // Fetches data from our API
  function loadList() {
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        json.results.forEach((item) => {
          let pokemon = {
            name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
            detailsUrl: item.url,
          };
          add(pokemon);
        });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  function loadDetails(item) {
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        item.imageUrl = details.sprites.front_shiny;
        item.id = details.id;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types;
        item.abilities = details.abilities;
      })
      .catch(function (e) {
        console.error(e);
      });
  }

  function getAll() {
    return pokemonList;
  }

  //Returns functions
  return {
    add: add,
    getAll: getAll,
    addListItem: addListItem,
    search: search,
    showDetails: showDetails,
    loadList: loadList,
    loadDetails: loadDetails,
    buttonEvent: buttonEvent,
  };
})();

// Loads the data being fetched

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
