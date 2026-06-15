// Clé API OpenWeatherMap — remplacez par votre clé gratuite sur openweathermap.org
const API_KEY = 'VOTRE_CLE_API_ICI';

// ===== Horloges =====

/**
 * Met à jour les deux horloges (Paris et New York) chaque seconde.
 */
const updateClocks = () => {
  const now = new Date();

  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };

  // Heure Paris
  document.getElementById('france-time').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...timeOptions, timeZone: 'Europe/Paris' }).format(now);
  document.getElementById('france-date').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...dateOptions, timeZone: 'Europe/Paris' }).format(now);

  // Heure New York
  document.getElementById('ny-time').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...timeOptions, timeZone: 'America/New_York' }).format(now);
  document.getElementById('ny-date').textContent =
    new Intl.DateTimeFormat('en-US', { ...dateOptions, timeZone: 'America/New_York' }).format(now);
};

// Lancement immédiat puis toutes les secondes
updateClocks();
setInterval(updateClocks, 1000);

// ===== Météo =====

/**
 * Affiche un message d'erreur dans la carte météo.
 * @param {string} message
 */
const showWeatherError = (message) => {
  const errorEl = document.getElementById('weather-error');
  const resultEl = document.getElementById('weather-result');
  resultEl.classList.add('hidden');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
};

/**
 * Efface les messages d'erreur et les résultats météo.
 */
const clearWeatherDisplay = () => {
  document.getElementById('weather-error').classList.add('hidden');
  document.getElementById('weather-result').classList.add('hidden');
};

/**
 * Récupère et affiche la météo pour une ville donnée.
 * @param {string} city
 */
const fetchWeather = async (city) => {
  const trimmedCity = city.trim();
  if (!trimmedCity) return;

  if (API_KEY === 'VOTRE_CLE_API_ICI') {
    showWeatherError('Clé API manquante. Ouvrez script.js et remplacez VOTRE_CLE_API_ICI par votre clé OpenWeatherMap.');
    return;
  }

  clearWeatherDisplay();
  document.getElementById('search-btn').textContent = '...';
  document.getElementById('search-btn').disabled = true;

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(trimmedCity)}&appid=${API_KEY}&units=metric&lang=fr`;
    const response = await fetch(url);

    if (response.status === 401) {
      showWeatherError('Clé API invalide. Vérifiez votre clé sur openweathermap.org.');
      return;
    }

    if (response.status === 404) {
      showWeatherError(`Ville "${trimmedCity}" introuvable. Vérifiez l'orthographe.`);
      return;
    }

    if (!response.ok) {
      showWeatherError('Erreur lors de la récupération des données météo. Réessayez plus tard.');
      return;
    }

    const data = await response.json();

    document.getElementById('weather-city').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('weather-temp').textContent = `${Math.round(data.main.temp)} °C`;
    document.getElementById('weather-desc').textContent = data.weather[0].description;
    document.getElementById('weather-icon').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    document.getElementById('weather-icon').alt = data.weather[0].description;

    document.getElementById('weather-result').classList.remove('hidden');

  } catch (error) {
    showWeatherError('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
  } finally {
    document.getElementById('search-btn').textContent = 'Rechercher';
    document.getElementById('search-btn').disabled = false;
  }
};

// ===== Événements =====

document.getElementById('search-btn').addEventListener('click', () => {
  fetchWeather(document.getElementById('city-input').value);
});

document.getElementById('city-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    fetchWeather(document.getElementById('city-input').value);
  }
});
