async function fetchPokemons() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=4";

  try {
      const response = await fetch(url);
      const data = await response.json();

      const pokemonList = await Promise.all(
          data.results.map(async (pokemon, index) => {
              const detailsResponse = await fetch(pokemon.url);
              const details = await detailsResponse.json();

              const speciesResponse = await fetch(details.species.url);
              const speciesData = await speciesResponse.json();

              return {
                  number: String(index + 1).padStart(2, "0"),
                  name: details.name,
                  image: details.sprites.front_default,
                  description: speciesData.flavor_text_entries.find(
                      entry => entry.language.name === "en"
                  )?.flavor_text || "No description available",
                  abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name)
              };
          })
      );

      updateCards(pokemonList);
  } catch (error) {
      console.error("Error fetching Pokémon:", error);
  }
}

function updateCards(pokemons) {
  const cards = document.querySelectorAll(".card");

  pokemons.forEach((pokemon, index) => {
      if (cards[index]) {
          cards[index].querySelector(".number p").textContent = pokemon.number;
          cards[index].querySelector(".card-title").textContent = pokemon.name;
          cards[index].querySelector(".card-text").textContent = pokemon.description;
          cards[index].querySelector(".habilidades").textContent = `Abilities: ${pokemon.abilities.join(", ")}`;
          const img = cards[index].querySelector(".card-image");
          img.src = pokemon.image;
          img.alt = pokemon.name;

          // 🔹 Animación al hacer hover en la imagen
          img.addEventListener("mouseenter", () => {
              img.animate([
                  { transform: "scale(1)" },
                  { transform: "scale(1.1)" }
              ], { duration: 300, fill: "forwards" });
          });

          img.addEventListener("mouseleave", () => {
              img.animate([
                  { transform: "scale(1.1)" },
                  { transform: "scale(1)" }
              ], { duration: 300, fill: "forwards" });
          });
      }
  });
}

fetchPokemons();
