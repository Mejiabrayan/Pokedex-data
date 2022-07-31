let pokemonRepository = (function () {
  let pokemonList = [];
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  // Global Variables
  let modalContainer = $(".modal");
  let modalDialog = $(".modal-dialog");
  let modalContent = $(".modal-content");
  let modalBody = $(".modal-body");
  let modalTitle = $(".modal-title");
  let modalHeader = $(".modal-header");
  let modalClose = $(".btn-close");
  let searchIcon = $(".btn-outline-secondary");

  let listItemArray = $("li");

  //Function adds pokemon and validates using typeof
  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      alert("pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }

  //  filters through pokemon names
  function search(pokemonName) {
    return pokemonList.filter((pokemon) => pokemon.name === pokemonName);
  }

  // Function adds a list of pokemon
  function addListItem(pokemon) {
    let pokemonDisplay = $(".list-group-horizontal");
    // Creates li element
    let listItem = $("<li>");
    listItem.addClass(
      "list-group-item text-center col-sm-6 col-md-4 border border-primary bg-image img-fluid"
    );
    // Creates h1 for Pokemon Name
    let listTitle = $("<h1>");
    listTitle.html(`${pokemon.name}`);
    listTitle.addClass("display-6");

    // Creates divs
    let listImg = $("<div>");
    loadDetails(pokemon).then(function () {
      listImg.append(
        `<img src=${pokemon.imageUrlFront} alt="${pokemon.name} sprite"/>`
      );
    });

    let listButton = $("<button>");
    listButton.html("show More");

    // Added Bootstrap Utility Class
    listButton.addClass("mp-2 btn btn-secondary");
    listButton.attr("type", "button");
    listButton.attr("data-toggle", "modal");
    listButton.attr("data-toggle", "#pokemonModal");

    listItem.append(listTitle);
    listItem.append(listImg);
    listItem.append(listButton);
    pokemonDisplay.append(listItem);

    buttonEvent(listButton, pokemon);
  }

  function buttonEvent(listButton, pokemon) {
    listButton.on("click", () => {
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
      // Clears existing content
      modalContainer.empty();

      modalTitle.addClass("modal-title h5 col-sml-3");

      let pokemonType = {
        fire: "text-danger",
        grass: "text-success",
        water: "text-primary",
        electric: "text-warning",
        flying: "text-info",
        poison: "text-secondary",
      };

      pokemon.types.forEach((type) =>
        modalTitle.addClass(pokemonType[type.type.name])
      );
      modalTitle.html(`<p><strong>${pokemon.name}</strong></p>`);

      modalBody.html(`
        Entry: ${pokemon.id}<br>
        Height: ${pokemon.height}<br>
        Weight: ${pokemon.weight}<br>
        Types: ${pokemon.types[0].type.name}`);

      if (pokemon.types.length === 2) {
        modalBody.innerHTML += `, ${pokemon.types[1].type.name}`;
      }

      modalBody.innerHTML += `<br>Abilities: ${pokemon.abilities[0]}.ability.name}`;

      if (pokemon.abilities.length === 2) {
        modalBody.innerHTML += `, ${pokemon.abilities[1]}.ability.name}`;
      }

      modalBody.append(`<br>
      <img src=${pokemon.imageUrlFront} alt="${pokemon.name} front sprite">
      <img src=${pokemon.imageUrlBack} alt="${pokemon.name} back sprite">
      <br>
      `);

      modalDialog.append(modalContent);
      modalContent.append(modalHeader);
      modalHeader.append(modalTitle);
      modalHeader.append(modalClose);
      modalContent.append(modalBody);
      modalContainer.append(modalDialog);
    });

    modalContainer.modal("show");
  }

  // Event Listeners

  modalClose.on("click", () => {
    modalContainer.removeClass("fade");
    // modalContainer.css({ display: "none" });
    modalContainer.show();

    listItemArray[0].lastChild.click();
  });

  searchIcon.on("click", () => {
    // fetching .d-flex class in form
    let bodyHeader = $(".d-flex");
    // returns the number of child elements
    if (bodyHeader.children().length === 1) {
      //creates input element
      let searchQuery = $("<input>");
      searchQuery.attr("placeholder", "Pokemon Name");
      searchQuery.attr("type", "search");
      searchQuery.attr("aria-label", "search Pokemon Name");
      searchQuery.addClass("form-control my-3 ps-2 col-sm");

      searchIcon.blur();
      searchQuery.focus();

      bodyHeader.append(searchQuery);

      searchQuery.on("keydown", (e) => {
        if (e.key === "Enter") {
          // prevents it from refreshing if we hit the enter key
          e.preventDefault();
          searchQuery.value =
            searchQuery.value.charAt(0).toUpperCase() +
            searchQuery.value.slice(1);

          for (let i = 0; i < listItemArray.length; i++) {
            if (
              902 > listItemArray[i].lastChild.getBoundingClientRect()["top"] &&
              listItemArray[i].lastChild.getBoundingClientRect()["top"] > 42
            ) {
              listItemArray[i].lastChild.click();
            }
          }
          for (let i = 0; i < listItemArray.length; i++) {
            if (
              listItemArray[i].innerText.split("\n")[0] === searchQuery.value
            ) {
              setTimeout(function () {
                listItemArray[i].lastChild.click();
              }, 5);
            }
          }
        }
      });
    }
  });

  // Fetches data from API
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
        item.imageUrlFront = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
        item.imageUrlFrontShiny = details.sprites.front_shiny;
        item.imageUrlBackShiny = details.sprites.back_shiny;
        item.id = details.id;
        item.height = details.height;
        item.weight = details.weight;
        item.types = details.types;
        item.abilities = details.abilities;
      })
      .catch(function (error) {
        console.error(error);
      });
  }

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
