document.getElementById("year").textContent = new Date().getFullYear();

async function searchCountry() {
  const query = document.getElementById("countryInput").value;
  const resultContainer = document.getElementById("resultContainer");
  resultContainer.innerHTML = "";

  try {
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    const countryData = await countryRes.json();
    const country = countryData[0];

    const lat = country.latlng[0];
    const lon = country.latlng[1];
    const capital = country.capital[0];

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weatherData = await weatherRes.json();

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Temperature:</strong> ${weatherData.current_weather.temperature}°C</p>
      <p><strong>Wind Speed:</strong> ${weatherData.current_weather.windspeed} km/h</p>
      <button onclick="showDetails(this)">More Details</button>
      <div class="details" style="display: none;">
        <img src="${country.flags.svg}" alt="Flag" class="flag">
        <p><strong>Official Name:</strong> ${country.name.official}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</p>
        <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>
      </div>
    `;

    resultContainer.appendChild(card);
  } catch (error) {
    console.error("Error:", error);
    resultContainer.innerHTML = "<p>Country not found or error fetching data.</p>";
  }
}

function showDetails(button) {
  const details = button.nextElementSibling;
  details.style.display = details.style.display === "none" ? "block" : "none";
}
