document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("searchBtn").addEventListener("click", async function() {
        await searchPokemons();
    });

    document.getElementById("addPokemonBtn").addEventListener("click", async function(event) {
        event.preventDefault();
        await addSelectedPokemon();
        document.getElementById("pokemonSearch").style.display = "block";
    });
});

async function searchPokemons() {
    const query = document.getElementById("searchInput").value.toLowerCase();
    const url = "https://pokeapi.co/api/v2/pokemon?limit=1000"; 

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

function populateResultsDropdown(pokemonList) {
    const resultsSelect = document.getElementById("pokemonResults");
    resultsSelect.innerHTML = ""; 

    pokemonList.forEach(pokemon => {
        const option = document.createElement("option");
        option.value = pokemon.url; 
        option.textContent = pokemon.name; 
        resultsSelect.appendChild(option);
    });
}

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
        console.log('Pokemon agregado', newPokemon);
        
    } catch (error) {
        console.error("Error añadiendo Pokémon:", error);
    }
}

function addNewCard(pokemon) {
    const cardContainer = document.querySelector(".card-container");

    const newCardHTML = `
        <div class="card" style="opacity: 0; transform: scale(0.8);">
            <div class="card-image" style="background-image: url(${pokemon.image}); background-size: cover; background-position: center; marin-right: 20px;">
                <img src="./assets/icons/eliminar.svg" alt="Botón Eliminar" class="eliminar">
            </div>
            <div class="card-content">
                <div class="number">
                    <p>${pokemon.number}</p>
                </div>
                <div class="description">
                    <div class="get">
                        <div class="slider"></div>
                        <p>Get Started</p>
                    </div>
                    <h3 class="card-title">${pokemon.name}</h3>
                    <p class="card-text">${pokemon.description}</p>
                    <p class="habilidades">Abilities: ${pokemon.abilities.join(", ")}</p>
                </div>
            </div>
        </div>`;

    cardContainer.insertAdjacentHTML("afterbegin", newCardHTML);
    const newCard = cardContainer.firstElementChild;
    
    // 🔹 Animación de aparición
    newCard.animate([
        { opacity: 0, transform: "scale(0.8)" },
        { opacity: 1, transform: "scale(1)" }
    ], { duration: 300, fill: "forwards" });

    // 🔹 Eventos `mouseenter` y `mouseleave` para animar la imagen
    const pokemonImg = newCard.querySelector(".card-image");
    pokemonImg.addEventListener("mouseenter", () => {
        pokemonImg.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }], { duration: 300, fill: "forwards" });
    });

    pokemonImg.addEventListener("mouseleave", () => {
        pokemonImg.animate([{ transform: "scale(1.1)" }, { transform: "scale(1)" }], { duration: 300, fill: "forwards" });
    });

    // 🔹 Evento para eliminar la card
    newCard.querySelector(".eliminar").addEventListener("click", function() {
        newCard.remove();
        console.log("Pokemon eliminado", pokemon);
    });
}