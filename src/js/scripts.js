let pokemonRepository = (function () {
  let pokemonList = [];
  // API
  let apiUrl = "https://pokeapi.co/api/v2/pokemon/?limit=150";

  let searchIcon = $(".search-btn");
  let modalContainer = $(".modal");
  let modalDialog = $(".modal-dialog");
  let modalContent = $(".modal-content");
  let modalBody = $(".modal-body");
  let modalTitle = $(".modal-title");
  let modalHeader = $(".modal-header");
  let modalClose = $(".btn-close");

  let listItemArray = $("li");

  function loadPage() {
    $("nav a").on("click", function (e) {
      e.preventDefault(); // Stop loading new link
      var url = this.href; // Get value of href

      $("nav a").remove("active"); // Clear current indicator
      $(this).addClass("active"); // New current indicator

      $("#container").remove(); // Remove old content
      $("#content").load(`${url} #container`).hide().fadeIn("slow");
    });
  }

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

  function addListItem(pokemon) {
    let pokemonDisplay = $(".list-group-horizontal");
    let listItem = $("<li>");
    listItem.addClass(
      "list-group-item text-center col-sm-6 col-md-4 border border-secondary bg-image img-fluid"
    );

    let listTitle = $("<h1>");
    listTitle.html(`${pokemon.name}`);
    listTitle.addClass("display-6");
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

    listButton.addClass("mp-2 btn btn-danger");
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
      modalContainer.fadeIn("slow");
      showDetails(pokemon);
    });
  }

  function showDetails(pokemon) {
    loadDetails(pokemon).then(() => {
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
    modalClose.on("click", () => {
      modalContainer.removeClass("fade");
      modalContainer.modal("hide");
      listItemArray.eq(0).children().click();
    });
  });

  searchIcon.on("click", (e) => {
    let bodyHeader = $(".d-flex");
    if (bodyHeader.children().length === 1) {
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
          searchQuery.val(
            (i, value) => value[0].toUpperCase() + value.slice(1)
          );
          for (let i = 0; i < listItemArray.length; i++) {
            const $el = listItemArray.eq(i).last(); // cache the element selector
            const topVal = $el[0].getBoundingClientRect()["top"]; // save the value
            if (topVal > 42 && topVal > 902) {
              $el.click();
            } else {
              console.log("error");
            }
          }
          for (let i = 0; i < listItemArray.length; i++) {
            if (
              listItemArray.eq(i).text().split("\n")[0] === searchQuery.val()
            ) {
              setTimeout(function () {
                listItemArray.eq(i).last().click();
              }, 5);
            } else {
              console.log("another error");
            }
          }
        }
      });
    }
    e.preventDefault();
  });

  // Fetches data from API
  async function loadList() {
    showLoadingMessage();
    try {
      const response = await fetch(apiUrl);
      const json = await response.json();
      hideLoadingMessage();
      json.results.forEach((item) => {
        let pokemon = {
          name: item.name.charAt(0).toUpperCase() + item.name.slice(1),
          detailsUrl: item.url,
        };
        add(pokemon);
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function loadDetails(item) {
    showLoadingMessage();
    let url = item.detailsUrl;
    try {
      const response = await fetch(url);
      const details = await response.json();
      hideLoadingMessage();
      item.imageUrlFront = details.sprites.front_default;
      item.imageUrlBack = details.sprites.back_default;
      item.id = details.id;
      item.height = details.height;
      item.weight = details.weight;
      item.types = details.types;
      item.abilities = details.abilities;
    } catch (error) {
      console.error(error);
    }
  }
  function showLoadingMessage() {
    $(".spinner-border").remove("d-none");
  }

  function hideLoadingMessage() {
    $(".spinner-border").addClass("d-none");
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
    loadPage: loadPage,
  };
})();

pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (pokemon) {
    pokemonRepository.addListItem(pokemon);
  });
});
