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
  
  // 🔹 Función para insertar los Pokémon en las cards
  function renderPokemons(pokemons) {
    const cardContainer = document.querySelector(".card-container");
  
    cardContainer.innerHTML = pokemons.map((pokemon) => `
      <div class="card">
        <div class="card-content">
          <div class="number">
            <p>${pokemon.number}</p> <!-- Número del Pokémon -->
          </div>
          <div class="description">
            <div class="get">
              <div class="slider"></div>
              <p>Pokémon Data</p>
            </div>
            <h3 class="card-title">${pokemon.name}</h3> <!-- Nombre del Pokémon -->
            <p class="card-text">${pokemon.description}</p> <!-- Descripción -->
            <p class="habilidades">Abilities: ${pokemon.abilities.join(", ")}</p> <!-- Habilidades -->
          </div>
        </div>
        <img src="${pokemon.image}" alt="${pokemon.name}" class="card-image"> <!-- Imagen -->
      </div>
    `).join(""); 
  }
  
  fetchPokemons();