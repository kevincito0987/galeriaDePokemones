async function fetchPokemons() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=4"; // Traemos solo 4 Pokémon para modificar las cards existentes
  
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
            number: String(index + 1).padStart(2, "0"), // Números con formato 01, 02, etc.
            name: details.name,
            image: details.sprites.front_default, // Imagen del Pokémon
            description: speciesData.flavor_text_entries.find(
              entry => entry.language.name === "en"
            )?.flavor_text || "No description available",
            abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name) // Primeras 3 habilidades
          };
        })
      );
  
      updateCards(pokemonList);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  }
  
  // 🔹 Función para reemplazar la información en las cards existentes
  function updateCards(pokemons) {
    const cards = document.querySelectorAll(".card");
  
    pokemons.forEach((pokemon, index) => {
      if (cards[index]) { // Solo reemplaza si la card existe
        cards[index].querySelector(".number p").textContent = pokemon.number; // Número
        cards[index].querySelector(".card-title").textContent = pokemon.name; // Nombre
        cards[index].querySelector(".card-text").textContent = pokemon.description; // Descripción
        cards[index].querySelector(".habilidades").textContent = `Abilities: ${pokemon.abilities.join(", ")}`; // Habilidades
        cards[index].querySelector(".card-image").src = pokemon.image; // Imagen
        cards[index].querySelector(".card-image").alt = pokemon.name;
      }
    });
  }
  
  fetchPokemons();