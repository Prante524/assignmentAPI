document.getElementById("year").textContent = new Date().getFullYear();

async function searchCountry() {
  const query = document.getElementById("countryInput").value.trim();
  const resultContainer = document.getElementById("resultContainer");
  const loader = document.getElementById("loader");
  resultContainer.innerHTML = "";
  
  if (!query) {
    alert("Please enter a country name!");
    return;
  }

  loader.style.display = "block";

  try {
    const countryRes = await fetch(`https://restcountries.com/v3.1/name/${query}`);
    const countryData = await countryRes.json();
    const country = countryData[0];
    
    const lat = country.latlng[0];
    const lon = country.latlng[1];
    const capital = country.capital ? country.capital[0] : "N/A";

    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=temperature_2m,relative_humidity_2m,cloudcover,weathercode,pressure_msl,winddirection_10m,uv_index`);
    const weatherData = await weatherRes.json();

    const weatherEmoji = getWeatherEmoji(weatherData.current_weather.weathercode);

    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>${country.name.common}</h2>
      <p><strong>Region:</strong> ${country.region}</p>
      <p><strong>Capital:</strong> ${capital}</p>
      <p><strong>Temperature:</strong> ${weatherData.current_weather.temperature}°C</p>
      <p><strong>Wind Speed:</strong> ${weatherData.current_weather.windspeed} km/h</p>
      <p><strong>Wind Direction:</strong> ${weatherData.current_weather.winddirection}°</p>
      <p><strong>Cloud Cover:</strong> ${weatherData.hourly.cloudcover[0]}%</p>
      <p><strong>Pressure:</strong> ${weatherData.hourly.pressure_msl[0]} hPa</p>
      <p><strong>Humidity:</strong> ${weatherData.hourly.relative_humidity_2m[0]}%</p>
      <p><strong>UV Index:</strong> ${weatherData.hourly.uv_index[0]}</p>
      <p><strong>Weather Condition:</strong> ${weatherEmoji}</p>

      <button onclick="showDetails(this)">More Details</button>
      
      <div class="details">
        <img src="${country.flags.svg}" alt="Flag" class="flag">
        <p><strong>Official Name:</strong> ${country.name.official}</p>
         <p><strong>Capital:</strong> ${capital}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
        <p><strong>Languages:</strong> ${Object.values(country.languages).join(", ")}</p>
        <p><strong>Timezones:</strong> ${country.timezones.join(", ")}</p>

        <div class="map-container">
          <iframe
            src="https://www.openstreetmap.org/export/embed.html?bbox=${lon-1}%2C${lat-1}%2C${lon+1}%2C${lat+1}&layer=mapnik&marker=${lat}%2C${lon}"
            style="width:100%; height:250px; border:none;"
            loading="lazy">
          </iframe>
        </div>
      </div>
    `;

    resultContainer.appendChild(card);
  } catch (error) {
    console.error("Error:", error);
    resultContainer.innerHTML = "<p>Country not found or error fetching data.</p>";
  } finally {
    loader.style.display = "none";
  }
}

function showDetails(button) {
  const details = button.nextElementSibling;
  details.style.display = details.style.display === "none" ? "block" : "none";
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

window.onscroll = function() {
  const topBtn = document.getElementById("topBtn");
  if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
    topBtn.style.display = "block";
  } else {
    topBtn.style.display = "none";
  }
};

function getWeatherEmoji(code) {
  if (code >= 0 && code <= 2) return "☀️";
  if (code == 3) return "⛅";
  if (code >= 45 && code <= 48) return "🌫️";
  if (code >= 51 && code <= 57) return "🌦️";
  if (code >= 61 && code <= 67) return "🌧️";
  if (code >= 71 && code <= 77) return "❄️";
  if (code >= 80 && code <= 82) return "🌧️";
  if (code >= 95 && code <= 99) return "⛈️";
  return "🌍";
}