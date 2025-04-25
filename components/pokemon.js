/* 🦸‍♂️ Función asincrónica para obtener Pokémon */
async function fetchPokemons() {
  const url = "https://pokeapi.co/api/v2/pokemon?limit=4"; // 🌐 URL de la API con límite de 4 Pokémon

  try {
      const response = await fetch(url); // 🔄 Solicitud a la API
      const data = await response.json(); // 📜 Convertir respuesta a JSON

      /* ⚡ Obtener detalles de cada Pokémon */
      const pokemonList = await Promise.all(
          data.results.map(async (pokemon, index) => {
              const detailsResponse = await fetch(pokemon.url); // 🔍 Detalles del Pokémon
              const details = await detailsResponse.json(); // 📜 Convertir a JSON

              const speciesResponse = await fetch(details.species.url); // 🔬 Datos de la especie
              const speciesData = await speciesResponse.json(); // 📜 Convertir a JSON

              return {
                  number: String(index + 1).padStart(2, "0"), // 🔢 Número formateado con 2 dígitos
                  name: details.name, // 🏷️ Nombre del Pokémon
                  image: details.sprites.front_default, // 🖼️ Imagen frontal
                  description: speciesData.flavor_text_entries.find(
                      entry => entry.language.name === "en"
                  )?.flavor_text || "No description available", // 📜 Descripción en inglés
                  abilities: details.abilities.slice(0, 3).map(ability => ability.ability.name) // 💪 Hasta 3 habilidades
              };
          })
      );

      updateCards(pokemonList); // 🎯 Actualizar las tarjetas con los datos obtenidos
  } catch (error) {
      console.error("Error fetching Pokémon:", error); // ⚠️ Manejo de error
  }
}

/* 🃏 Función para actualizar las tarjetas con los datos obtenidos */
function updateCards(pokemons) {
  const cards = document.querySelectorAll(".card"); // 📌 Obtener todas las tarjetas

  /* 🔄 Iterar sobre cada Pokémon */
  pokemons.forEach((pokemon, index) => {
      if (cards[index]) {
          cards[index].querySelector(".number p").textContent = pokemon.number; // 🔢 Agregar número
          cards[index].querySelector(".card-title").textContent = pokemon.name; // 🏷️ Agregar nombre
          cards[index].querySelector(".card-text").textContent = pokemon.description; // 📜 Agregar descripción
          cards[index].querySelector(".habilidades").textContent = `Abilities: ${pokemon.abilities.join(", ")}`; // 💪 Agregar habilidades
          
          const img = cards[index].querySelector(".card-image"); // 🖼️ Obtener la imagen
          img.src = pokemon.image; // 📷 Asignar la imagen
          img.alt = pokemon.name; // 🏷️ Agregar atributo alt

          /* 🎭 Animación al hacer hover en la imagen */
          img.addEventListener("mouseenter", () => {
              img.animate([
                  { transform: "scale(1)" },
                  { transform: "scale(1.1)" }
              ], { duration: 300, fill: "forwards" }); // 🔄 Zoom-in suave
          });

          img.addEventListener("mouseleave", () => {
              img.animate([
                  { transform: "scale(1.1)" },
                  { transform: "scale(1)" }
              ], { duration: 300, fill: "forwards" }); // 🔄 Zoom-out suave
          });
      }
  });
}

/* 🚀 Ejecutar la función principal */
fetchPokemons();
