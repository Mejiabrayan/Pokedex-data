let pokemonRepository = (function () {
  let h = [],
    i = $(".modal"),
    j = $(".modal-dialog"),
    k = $(".modal-content"),
    l = $(".modal-body"),
    m = $(".modal-title"),
    n = $(".modal-header"),
    a = $(".btn-close"),
    b = $(".btn-outline-secondary"),
    o = $("li");
  function c(a) {
    "object" == typeof a && "name" in a && "detailsUrl" in a
      ? h.push(a)
      : alert("pokemon is not correct");
  }
  function d() {
    return h;
  }
  function e(a, b) {
    a.on("click", () => {
      f(b);
    });
  }
  function f(b) {
    g(b).then(() => {
      i.empty(), m.addClass("modal-title h5 col-sml-3");
      let c = {
        fire: "text-danger",
        grass: "text-success",
        water: "text-primary",
        electric: "text-warning",
        flying: "text-info",
        poison: "text-secondary",
      };
      b.types.forEach((a) => m.addClass(c[a.type.name])),
        m.html(`<p><strong>${b.name}</strong></p>`),
        l.html(`
        Entry: ${b.id}<br>
        Height: ${b.height}<br>
        Weight: ${b.weight}<br>
        Types: ${b.types[0].type.name}`),
        2 === b.types.length && (l.innerHTML += `, ${b.types[1].type.name}`),
        (l.innerHTML += `<br>Abilities: ${b.abilities[0]}.ability.name}`),
        2 === b.abilities.length &&
          (l.innerHTML += `, ${b.abilities[1]}.ability.name}`),
        l.append(`<br>
      <img src=${b.imageUrlFront} alt="${b.name} front sprite">
      <img src=${b.imageUrlBack} alt="${b.name} back sprite">
      <br>
      `),
        j.append(k),
        k.append(n),
        n.append(m),
        n.append(a),
        k.append(l),
        i.append(j);
    }),
      i.modal("show");
  }
  function g(a) {
    return fetch(a.detailsUrl)
      .then(function (a) {
        return a.json();
      })
      .then(function (b) {
        (a.imageUrlFront = b.sprites.front_default),
          (a.imageUrlBack = b.sprites.back_default),
          (a.imageUrlFrontShiny = b.sprites.front_shiny),
          (a.imageUrlBackShiny = b.sprites.back_shiny),
          (a.id = b.id),
          (a.height = b.height),
          (a.weight = b.weight),
          (a.types = b.types),
          (a.abilities = b.abilities);
      })
      .catch(function (a) {
        console.error(a);
      });
  }
  return (
    a.on("click", () => {
      i.removeClass("fade"), i.show(), o[0].lastChild.click();
    }),
    b.on("click", () => {
      let c = $(".d-flex");
      if (1 === c.children().length) {
        let a = $("<input>");
        a.attr("placeholder", "Pokemon Name"),
          a.attr("type", "search"),
          a.attr("aria-label", "search Pokemon Name"),
          a.addClass("form-control my-3 ps-2 col-sm"),
          b.blur(),
          a.focus(),
          c.append(a),
          a.on("keydown", (d) => {
            if ("Enter" === d.key) {
              d.preventDefault(),
                (a.value = a.value.charAt(0).toUpperCase() + a.value.slice(1));
              for (let b = 0; b < o.length; b++)
                902 > o[b].lastChild.getBoundingClientRect().top &&
                  o[b].lastChild.getBoundingClientRect().top > 42 &&
                  o[b].lastChild.click();
              for (let c = 0; c < o.length; c++)
                o[c].innerText.split("\n")[0] === a.value &&
                  setTimeout(function () {
                    o[c].lastChild.click();
                  }, 5);
            }
          });
      }
    }),
    {
      add: c,
      getAll: d,
      addListItem: function (c) {
        let f = $(".list-group-horizontal"),
          b = $("<li>");
        b.addClass(
          "list-group-item text-center col-sm-6 col-md-4 border border-primary bg-image img-fluid"
        );
        let d = $("<h1>");
        d.html(`${c.name}`), d.addClass("display-6");
        let h = $("<div>");
        g(c).then(function () {
          h.append(`<img src=${c.imageUrlFront} alt="${c.name} sprite"/>`);
        });
        let a = $("<button>");
        a.html("show More"),
          a.addClass("mp-2 btn btn-secondary"),
          a.attr("type", "button"),
          a.attr("data-toggle", "modal"),
          a.attr("data-toggle", "#pokemonModal"),
          b.append(d),
          b.append(h),
          b.append(a),
          f.append(b),
          e(a, c);
      },
      search: function (a) {
        return h.filter((b) => b.name === a);
      },
      showDetails: f,
      loadList: function () {
        return fetch("https://pokeapi.co/api/v2/pokemon/?limit=150")
          .then(function (a) {
            return a.json();
          })
          .then(function (a) {
            a.results.forEach((a) => {
              c({
                name: a.name.charAt(0).toUpperCase() + a.name.slice(1),
                detailsUrl: a.url,
              });
            });
          })
          .catch(function (a) {
            console.error(a);
          });
      },
      loadDetails: g,
      buttonEvent: e,
    }
  );
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (a) {
    pokemonRepository.addListItem(a);
  });
});
