document.querySelector(".filters a:nth-child(2)").addEventListener("click", async function(event) {
    event.preventDefault(); // Evita recargas innecesarias
  
    const randomId = Math.floor(Math.random() * 100) + 1; // Genera un ID aleatorio de Pokémon
    const url = `https://pokeapi.co/api/v2/pokemon/${randomId}`;
  
    try {
      const response = await fetch(url);
      const details = await response.json();
  
      const speciesResponse = await fetch(details.species.url);
      const speciesData = await speciesResponse.json();
  
      const newPokemon = {
        number: String(randomId).padStart(2, "0"),
        name: details.name,
        image: details.sprites.front_default,
        description: speciesData.flavor_text_entries.find(
          entry => entry.language.name === "en"
        )?.flavor_text || "No description available",
        abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name)
      };
  
      addNewCard(newPokemon);
    } catch (error) {
      console.error("Error fetching new Pokémon:", error);
    }
  });
  
  // 🔹 Función para insertar la nueva card al comienzo
  function addNewCard(pokemon) {
    const cardContainer = document.querySelector(".card-container");
  
    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.innerHTML = `
      <div class="card-content">
        <div class="number">
          <p>${pokemon.number}</p>
        </div>
        <div class="description">
          <div class="get">
            <div class="slider"></div>
            <p>Nuevo Pokémon</p>
          </div>
          <h3 class="card-title">${pokemon.name}</h3>
          <p class="card-text">${pokemon.description}</p>
          <p class="habilidades">Abilities: ${pokemon.abilities.join(", ")}</p>
        </div>
      </div>
      <img src="${pokemon.image}" alt="${pokemon.name}" class="card-image">
    `;
  
    cardContainer.prepend(newCard); // Agrega la nueva card al inicio
  }
  