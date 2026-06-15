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

updateClocks();
setInterval(updateClocks, 1000);

// ===== Météo — Open-Meteo (aucune clé API requise) =====

// Correspondance codes météo WMO → description et emoji
const WEATHER_CODES = {
  0:  { desc: 'Ciel dégagé',        icon: '☀️' },
  1:  { desc: 'Principalement dégagé', icon: '🌤️' },
  2:  { desc: 'Partiellement nuageux', icon: '⛅' },
  3:  { desc: 'Couvert',             icon: '☁️' },
  45: { desc: 'Brouillard',          icon: '🌫️' },
  48: { desc: 'Brouillard givrant',  icon: '🌫️' },
  51: { desc: 'Bruine légère',       icon: '🌦️' },
  53: { desc: 'Bruine modérée',      icon: '🌦️' },
  55: { desc: 'Bruine dense',        icon: '🌧️' },
  61: { desc: 'Pluie légère',        icon: '🌧️' },
  63: { desc: 'Pluie modérée',       icon: '🌧️' },
  65: { desc: 'Pluie forte',         icon: '🌧️' },
  71: { desc: 'Neige légère',        icon: '🌨️' },
  73: { desc: 'Neige modérée',       icon: '❄️' },
  75: { desc: 'Neige forte',         icon: '❄️' },
  77: { desc: 'Grains de neige',     icon: '🌨️' },
  80: { desc: 'Averses légères',     icon: '🌦️' },
  81: { desc: 'Averses modérées',    icon: '🌧️' },
  82: { desc: 'Averses violentes',   icon: '⛈️' },
  85: { desc: 'Averses de neige',    icon: '🌨️' },
  86: { desc: 'Averses de neige fortes', icon: '❄️' },
  95: { desc: 'Orage',               icon: '⛈️' },
  96: { desc: 'Orage avec grêle',    icon: '⛈️' },
  99: { desc: 'Orage avec forte grêle', icon: '⛈️' },
};

/**
 * Affiche un message d'erreur dans la carte météo.
 * @param {string} message
 */
const showWeatherError = (message) => {
  document.getElementById('weather-result').classList.add('hidden');
  const errorEl = document.getElementById('weather-error');
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
 * Récupère et affiche la météo pour une ville donnée via Open-Meteo.
 * Étape 1 : géocodage du nom de ville → coordonnées GPS.
 * Étape 2 : récupération des données météo actuelles.
 * @param {string} city
 */
const fetchWeather = async (city) => {
  const trimmedCity = city.trim();
  if (!trimmedCity) return;

  clearWeatherDisplay();
  const btn = document.getElementById('search-btn');
  btn.textContent = '...';
  btn.disabled = true;

  try {
    // Étape 1 — Géocodage
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=1&language=fr&format=json`;
    const geoResponse = await fetch(geoUrl);

    if (!geoResponse.ok) {
      showWeatherError('Erreur de connexion. Vérifiez votre réseau.');
      return;
    }

    const geoData = await geoResponse.json();

    if (!geoData.results || geoData.results.length === 0) {
      showWeatherError(`Ville "${trimmedCity}" introuvable. Vérifiez l'orthographe.`);
      return;
    }

    const { latitude, longitude, name, country } = geoData.results[0];

    // Étape 2 — Météo actuelle
    const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code&wind_speed_unit=kmh&timezone=auto`;
    const weatherResponse = await fetch(weatherUrl);

    if (!weatherResponse.ok) {
      showWeatherError('Impossible de récupérer la météo. Réessayez plus tard.');
      return;
    }

    const weatherData = await weatherResponse.json();
    const current = weatherData.current;
    const code = current.weather_code;
    const weather = WEATHER_CODES[code] || { desc: 'Conditions inconnues', icon: '🌡️' };

    // Affichage
    document.getElementById('weather-icon').textContent = weather.icon;
    document.getElementById('weather-city').textContent = `${name}, ${country}`;
    document.getElementById('weather-temp').textContent = `${Math.round(current.temperature_2m)} °C`;
    document.getElementById('weather-desc').textContent = weather.desc;
    document.getElementById('weather-result').classList.remove('hidden');

  } catch (error) {
    showWeatherError('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
  } finally {
    btn.textContent = 'Rechercher';
    btn.disabled = false;
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
