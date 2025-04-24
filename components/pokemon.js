async function fetchPokemons() {
    const url = "https://pokeapi.co/api/v2/pokemon?limit=4"; // Solo traemos 4 Pokémon para las cards
  
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
            number: String(index + 1).padStart(2, "0"), // Números con formato 01, 02...
            name: details.name,
            image: details.sprites.front_default, // Imagen del Pokémon
            description: speciesData.flavor_text_entries.find(
              entry => entry.language.name === "en"
            )?.flavor_text || "No description available",
            abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name) // Primeras 3 habilidades
          };
        })
      );
  
      renderPokemons(pokemonList);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
    }
  }
  
  