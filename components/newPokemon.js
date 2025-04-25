/* 🔄 Ejecutar funciones cuando el DOM esté cargado */
document.addEventListener("DOMContentLoaded", function () {
    /* 🎯 Evento de búsqueda de Pokémon */
    document.getElementById("searchBtn").addEventListener("click", async function() {
        await searchPokemons(); // 🔍 Llama a la función de búsqueda
    });

    /* ➕ Evento para agregar un nuevo Pokémon */
    document.getElementById("addPokemonBtn").addEventListener("click", async function(event) {
        event.preventDefault(); // 🚫 Evita la recarga de la página
        await addSelectedPokemon(); // 🏆 Agrega el Pokémon seleccionado
        document.getElementById("pokemonSearch").style.display = "block"; // 📂 Muestra el área de búsqueda
    });
});

/* 🔍 Función para buscar Pokémon */
async function searchPokemons() {
    const query = document.getElementById("searchInput").value.toLowerCase(); // 📝 Captura el valor ingresado
    const url = "https://pokeapi.co/api/v2/pokemon?limit=1000"; // 🌐 URL con límite alto para búsqueda

    try {
        const response = await fetch(url); // 🔄 Obtiene los datos desde la API
        const data = await response.json(); // 📜 Convierte la respuesta a JSON

        /* 🎯 Filtra los Pokémon que coincidan con la búsqueda */
        const matchedPokemons = data.results.filter(pokemon =>
            pokemon.name.includes(query) // 🔍 Busca coincidencias en el nombre
        );

        populateResultsDropdown(matchedPokemons); // 📂 Llena el menú de resultados
    } catch (error) {
        console.error("Error buscando Pokémon:", error); // ⚠️ Manejo de error
    }
}

/* 📂 Llenar el menú de selección con los resultados */
function populateResultsDropdown(pokemonList) {
    const resultsSelect = document.getElementById("pokemonResults"); // 📜 Elemento de selección
    resultsSelect.innerHTML = ""; // 🚮 Limpia los resultados anteriores

    /* 🔄 Itera sobre cada Pokémon encontrado */
    pokemonList.forEach(pokemon => {
        const option = document.createElement("option"); // 🏷️ Crea una nueva opción
        option.value = pokemon.url; // 🌐 URL del Pokémon
        option.textContent = pokemon.name; // 🏷️ Nombre del Pokémon
        resultsSelect.appendChild(option); // 🔗 Agrega la opción al menú
    });
}

/* ➕ Agregar Pokémon seleccionado */
async function addSelectedPokemon() {
    const selectedUrl = document.getElementById("pokemonResults").value; // 🖥️ Captura la URL seleccionada
    if (!selectedUrl) return; // 🚫 Evita errores si no se seleccionó nada

    try {
        const detailsResponse = await fetch(selectedUrl); // 🔄 Obtiene datos del Pokémon
        const details = await detailsResponse.json(); // 📜 Convierte a JSON

        const speciesResponse = await fetch(details.species.url); // 🔬 Obtiene datos de la especie
        const speciesData = await speciesResponse.json(); // 📜 Convierte a JSON

        /* 🆕 Objeto con los datos del nuevo Pokémon */
        const newPokemon = {
            number: String(details.id).padStart(2, "0"), // 🔢 Número con formato
            name: details.name, // 🏷️ Nombre del Pokémon
            image: details.sprites.front_default, // 🖼️ Imagen
            description: speciesData.flavor_text_entries.find(
                entry => entry.language.name === "en"
            )?.flavor_text || "No description available", // 📜 Descripción en inglés
            abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name) // 💪 Hasta 3 habilidades
        };

        addNewCard(newPokemon); // 🃏 Agrega el Pokémon a la tarjeta
        console.log('Pokémon agregado', newPokemon); // 🖥️ Registra el resultado
        
    } catch (error) {
        console.error("Error añadiendo Pokémon:", error); // ⚠️ Manejo de error
    }
}

/* 🃏 Agregar nueva tarjeta con el Pokémon seleccionado */
function addNewCard(pokemon) {
    const cardContainer = document.querySelector(".card-container"); // 📂 Contenedor de tarjetas

    /* 📜 HTML de la nueva tarjeta */
    const newCardHTML = `
        <div class="card" style="opacity: 0; transform: scale(0.8);">
            <div class="card-image" style="background-image: url(${pokemon.image}); background-size: cover; background-position: center; margin-right: 20px;">
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

    cardContainer.insertAdjacentHTML("afterbegin", newCardHTML); // 📌 Agrega la tarjeta al inicio
    const newCard = cardContainer.firstElementChild; // 📍 Captura la nueva tarjeta
    
    /* 🔹 Animación de aparición */
    newCard.animate([
        { opacity: 0, transform: "scale(0.8)" },
        { opacity: 1, transform: "scale(1)" }
    ], { duration: 300, fill: "forwards" });

    /* 🎭 Animación de imagen */
    const pokemonImg = newCard.querySelector(".card-image");
    pokemonImg.addEventListener("mouseenter", () => {
        pokemonImg.animate([{ transform: "scale(1)" }, { transform: "scale(1.1)" }], { duration: 300, fill: "forwards" });
    });

    pokemonImg.addEventListener("mouseleave", () => {
        pokemonImg.animate([{ transform: "scale(1.1)" }, { transform: "scale(1)" }], { duration: 300, fill: "forwards" });
    });

    /* 🗑️ Evento para eliminar la tarjeta */
    newCard.querySelector(".eliminar").addEventListener("click", function() {
        newCard.remove(); // 🚮 Elimina la tarjeta
        console.log("Pokémon eliminado", pokemon); // 🖥️ Registro de eliminación
    });
}
