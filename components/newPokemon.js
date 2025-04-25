document.addEventListener("DOMContentLoaded", function () {
    // Evento para buscar Pokémon cuando se haga clic en "Buscar"
    document.getElementById("searchBtn").addEventListener("click", async function() {
        await searchPokemons();
    });

    // Evento para agregar la card del Pokémon seleccionado cuando se haga clic en "Nuevo Pokémon"
    document.getElementById("addPokemonBtn").addEventListener("click", async function(event) {
        event.preventDefault();
        await addSelectedPokemon(); 

        // 🔹 Mantener visible el input de búsqueda después de agregar un Pokémon
        document.getElementById("pokemonSearch").style.display = "block";
    });
});

// 🔹 Función para buscar Pokémon por coincidencia dentro de los primeros 500 registros
async function searchPokemons() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const url = "https://pokeapi.co/api/v2/pokemon?limit=500"; 

    try {
        const response = await fetch(url);
        const data = await response.json();

        const matchedPokemons = data.results.filter(pokemon =>
            pokemon.name.includes(query)
        );

        populateResultsDropdown(matchedPokemons);
    } catch (error) {
        console.error("Error buscando Pokémon:", error);
    }
}

// 🔹 Función para llenar el `<select>` con los Pokémon filtrados
function populateResultsDropdown(pokemonList) {
    const resultsSelect = document.getElementById("pokemonResults");
    resultsSelect.innerHTML = ""; // Limpia opciones previas

    pokemonList.forEach(pokemon => {
        const option = document.createElement("option");
        option.value = pokemon.url; 
        option.textContent = pokemon.name; 
        resultsSelect.appendChild(option);
    });
}

// 🔹 Función para obtener detalles del Pokémon seleccionado y agregarlo como nueva card
async function addSelectedPokemon() {
    const selectedUrl = document.getElementById("pokemonResults").value;
    if (!selectedUrl) return;

    try {
        const detailsResponse = await fetch(selectedUrl);
        const details = await detailsResponse.json();

        const speciesResponse = await fetch(details.species.url);
        const speciesData = await speciesResponse.json();

        const newPokemon = {
            number: String(details.id).padStart(2, "0"),
            name: details.name,
            image: details.sprites.front_default,
            description: speciesData.flavor_text_entries.find(
                entry => entry.language.name === "en"
            )?.flavor_text || "No description available",
            abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name)
        };

        addNewCard(newPokemon);
    } catch (error) {
        console.error("Error añadiendo Pokémon:", error);
    }
}

// 🔹 Función para insertar la nueva card al inicio con botón de eliminar
function addNewCard(pokemon) {
    const cardContainer = document.querySelector(".card-container");

    const newCard = document.createElement("div");
    newCard.classList.add("card");
    newCard.innerHTML = `
        <div class="card-image" style="background-image: url(${pokemon.image}); background-size: cover; background-position: center;">
            <img src="./assets/icons/eliminar.svg" alt="Botón Eliminar" class="eliminar">
        </div>
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
    `;

    // 🔹 Evento para eliminar la card al hacer clic en el botón de eliminar
    newCard.querySelector(".eliminar").addEventListener("click", function() {
        newCard.remove(); // 🔹 Elimina la card seleccionada
    });

    cardContainer.prepend(newCard); // Agrega la nueva card al inicio
}
