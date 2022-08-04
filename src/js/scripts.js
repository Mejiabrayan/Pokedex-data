let pokemonRepository = (function () {
  let pokemonList = [];
  // API
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  let searchIcon = $(".btn-outline-secondary");
  let modalContainer = $(".modal");
  let modalDialog = $(".modal-dialog");
  let modalContent = $(".modal-content");
  let modalBody = $(".modal-body");
  let modalTitle = $(".modal-title");
  let modalHeader = $(".modal-header");
  let modalClose = $(".btn-close");

  let listItemArray = $("li");

  function add(pokemon) {
    if (
      typeof pokemon === "object" &&
      "name" in pokemon &&
      "detailsUrl" in pokemon
    ) {
      pokemonList.push(pokemon);
    } else {
      console.error("pokemon is not correct");
    }
  }

  function getAll() {
    return pokemonList;
  }
  function search(pokemonName) {
    return pokemonList.filter((pokemon) => pokemon.name === pokemonName);
  }

  // Function adds a list of pokemon
  function addListItem(pokemon) {
    let pokemonDisplay = $(".list-group-horizontal");
    // Creates li element
    let listItem = $("<li>");
    listItem.addClass(
      "list-group-item text-center col-sm-6 col-md-4 border border-secondary bg-image img-fluid"
    );

    // Creates h1 for Pokemon Name
    let listTitle = $("<h1>");
    listTitle.html(`${pokemon.name}`);
    listTitle.addClass("display-6");

    // Creates div which holds sprites
    let listImg = $("<div>");
    loadDetails(pokemon).then(function () {
      listImg.append(
        `<img src=${pokemon.imageUrlFront} alt="${pokemon.name} sprite"/>`
      );
    });

    let listButton = $("<button>");
    listButton.text("show More");
    listButton.css({
      "box-shadow": "0 2px 5px 0 rgba(0,0,0,.2),0 2px 10px 0 rgba(0,0,0,.1)",
    });

    // Added Bootstrap Utility Class
    listButton.addClass("mp-2 btn btn-secondary");
    listButton.attr("type", "button");
    listButton.attr("data-bs-toggle", "modal");
    listButton.attr("data-bs-toggle", "#pokemonModal");

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
      modalTitle.html(`${pokemon.name}`);

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

  modalContainer.on("shown.bs.modal", () => {
    // Jquery eventlistener
    modalClose.on("click", () => {
      modalContainer.removeClass("fade");
      modalContainer.modal("hide");
      listItemArray[0].children().click();
    });
  });

  searchIcon.on("click", (e) => {
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
          e.preventDefault();
          searchQuery.val(
            (i, value) => value[0].toUpperCase() + value.slice(1)
          );

          for (let i = 0; i < listItemArray.length; i++) {
            if (
              902 > listItemArray.eq(i).last().getBoundingClientRect()["top"] &&
              listItemArray.eq(i).last().getBoundingClientRect()["top"] > 42
            ) {
              listItemArray.eq(i).last().click();
            }
          }
          for (let i = 0; i < listItemArray.length; i++) {
            if (
              listItemArray.eq(i).text().split("\n")[0] === searchQuery.val()
            ) {
              setTimeout(function () {
                listItemArray.eq(i).last().click();
              }, 5);
            }
          }
        }
      });
    }
    // e.preventDefault();
  });

  // Fetches data from API
  function loadList() {
    showLoadingMessage();
    return fetch(apiUrl)
      .then(function (response) {
        return response.json();
      })
      .then(function (json) {
        hideLoadingMessage();
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
    showLoadingMessage();
    let url = item.detailsUrl;
    return fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (details) {
        hideLoadingMessage();
        item.imageUrlFront = details.sprites.front_default;
        item.imageUrlBack = details.sprites.back_default;
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
  function showLoadingMessage() {
    $(".text-muted").remove("d-none");
  }

  function hideLoadingMessage() {
    $(".text-muted").addClass("d-none");
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

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
