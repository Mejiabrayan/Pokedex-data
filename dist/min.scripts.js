let pokemonRepository = (function () {
  let e = [],
    t = "https://pokeapi.co/api/v2/pokemon/?limit=150",
    n = $(".search-btn"),
    a = $(".modal"),
    o = $(".modal-dialog"),
    i = $(".modal-content"),
    l = $(".modal-body"),
    r = $(".modal-title"),
    s = $(".modal-header"),
    c = $(".btn-close"),
    d = $("li");
  function p(t) {
    "object" == typeof t && "name" in t && "detailsUrl" in t
      ? e.push(t)
      : console.error("pokemon is not correct");
  }
  function m(e, t) {
    e.on("click", () => {
      a.fadeIn("slow"), h(t);
    });
  }
  function h(e) {
    f(e).then(() => {
      a.empty(), r.addClass("modal-title h5 col-sml-3");
      let t = {
        fire: "text-danger",
        grass: "text-success",
        water: "text-primary",
        electric: "text-warning",
        flying: "text-info",
        poison: "text-secondary",
      };
      e.types.forEach((e) => r.addClass(t[e.type.name])),
        r.html(`${e.name}`),
        l.html(
          `\n        Entry: ${e.id}<br>\n        Height: ${e.height}<br>\n        Weight: ${e.weight}<br>\n        Types: ${e.types[0].type.name}`
        ),
        2 === e.types.length && (l.innerHTML += `, ${e.types[1].type.name}`),
        (l.innerHTML += `<br>Abilities: ${e.abilities[0]}.ability.name}`),
        2 === e.abilities.length &&
          (l.innerHTML += `, ${e.abilities[1]}.ability.name}`),
        l.append(
          `<br>\n      <img src=${e.imageUrlFront} alt="${e.name} front sprite">\n      <img src=${e.imageUrlBack} alt="${e.name} back sprite">\n      <br>\n      `
        ),
        o.append(i),
        i.append(s),
        s.append(r),
        s.append(c),
        i.append(l),
        a.append(o);
    }),
      a.modal("show");
  }
  async function f(e) {
    g();
    let t = e.detailsUrl;
    try {
      const n = await fetch(t),
        a = await n.json();
      u(),
        (e.imageUrlFront = a.sprites.front_default),
        (e.imageUrlBack = a.sprites.back_default),
        (e.id = a.id),
        (e.height = a.height),
        (e.weight = a.weight),
        (e.types = a.types),
        (e.abilities = a.abilities);
    } catch (e) {
      console.error(e);
    }
  }
  function g() {
    $(".spinner-border").remove("d-none");
  }
  function u() {
    $(".spinner-border").addClass("d-none");
  }
  return (
    a.on("shown.bs.modal", () => {
      c.on("click", () => {
        a.removeClass("fade"), a.modal("hide"), d.eq(0).children().click();
      });
    }),
    n.on("click", (e) => {
      let t = $(".d-flex");
      if (1 === t.children().length) {
        let e = $("<input>");
        e.attr("placeholder", "Pokemon Name"),
          e.attr("type", "search"),
          e.attr("aria-label", "search Pokemon Name"),
          e.addClass("form-control my-3 ps-2 col-sm"),
          n.blur(),
          e.focus(),
          t.append(e),
          e.on("keydown", (t) => {
            if ("Enter" === t.key) {
              e.val((e, t) => t[0].toUpperCase() + t.slice(1));
              for (let e = 0; e < d.length; e++) {
                const t = d.eq(e).last(),
                  n = t[0].getBoundingClientRect().top;
                n > 42 && n > 902 ? t.click() : console.log("error");
              }
              for (let t = 0; t < d.length; t++)
                d.eq(t).text().split("\n")[0] === e.val()
                  ? setTimeout(function () {
                      d.eq(t).last().click();
                    }, 5)
                  : console.log("another error");
            }
          });
      }
      e.preventDefault();
    }),
    {
      add: p,
      getAll: function () {
        return e;
      },
      addListItem: function (e) {
        let t = $(".list-group-horizontal"),
          n = $("<li>");
        n.addClass(
          "list-group-item text-center col-sm-6 col-md-4 border border-secondary bg-image img-fluid"
        );
        let a = $("<h1>");
        a.html(`${e.name}`), a.addClass("display-6");
        let o = $("<div>");
        f(e).then(function () {
          o.append(`<img src=${e.imageUrlFront} alt="${e.name} sprite"/>`);
        });
        let i = $("<button>");
        i.text("show More"),
          i.css({
            "box-shadow":
              "0 2px 5px 0 rgba(0,0,0,.2),0 2px 10px 0 rgba(0,0,0,.1)",
          }),
          i.addClass("mp-2 btn btn-danger"),
          i.attr("type", "button"),
          i.attr("data-bs-toggle", "modal"),
          i.attr("data-bs-toggle", "#pokemonModal"),
          n.append(a),
          n.append(o),
          n.append(i),
          t.append(n),
          m(i, e);
      },
      search: function (t) {
        return e.filter((e) => e.name === t);
      },
      showDetails: h,
      loadList: async function () {
        g();
        try {
          const e = await fetch(t),
            n = await e.json();
          u(),
            n.results.forEach((e) => {
              p({
                name: e.name.charAt(0).toUpperCase() + e.name.slice(1),
                detailsUrl: e.url,
              });
            });
        } catch (e) {
          console.error(e);
        }
      },
      loadDetails: f,
      buttonEvent: m,
      loadPage: function () {
        $("nav a").on("click", function (e) {
          e.preventDefault();
          var t = this.href;
          $("nav a").removeClass("active"),
            $(this).addClass("active"),
            $(".container").remove(),
            $(".content").load(`${t} .container`).hide().fadeIn("slow");
        });
      },
    }
  );
})();
pokemonRepository.loadList().then(function () {
  pokemonRepository.getAll().forEach(function (e) {
    pokemonRepository.addListItem(e);
  });
});