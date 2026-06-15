// ===== Horloges =====

/**
 * Met à jour les deux horloges (Paris et New York) chaque seconde.
 */
const updateClocks = () => {
  const now = new Date();

  const timeOptions = { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const dateOptions = { weekday: 'long', day: 'numeric', month: 'long' };
  const yearOptions = { year: 'numeric' };

  // Heure Paris
  document.getElementById('france-time').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...timeOptions, timeZone: 'Europe/Paris' }).format(now);
  document.getElementById('france-date').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...dateOptions, timeZone: 'Europe/Paris' }).format(now);
  document.getElementById('france-year').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...yearOptions, timeZone: 'Europe/Paris' }).format(now);

  // Heure New York
  document.getElementById('ny-time').textContent =
    new Intl.DateTimeFormat('fr-FR', { ...timeOptions, timeZone: 'America/New_York' }).format(now);
  document.getElementById('ny-date').textContent =
    new Intl.DateTimeFormat('en-US', { ...dateOptions, timeZone: 'America/New_York' }).format(now);
  document.getElementById('ny-year').textContent =
    new Intl.DateTimeFormat('en-US', { ...yearOptions, timeZone: 'America/New_York' }).format(now);
};

updateClocks();
setInterval(updateClocks, 1000);

// ===== Emoji température =====

const TEMP_EMOJIS = [
  { max: -10, emoji: '🧊' }, // Grand froid
  { max: 0,   emoji: '🥶' }, // Gelé
  { max: 8,   emoji: '🧥' }, // Très froid
  { max: 15,  emoji: '🌬️' }, // Frais
  { max: 20,  emoji: '😊' }, // Agréable
  { max: 26,  emoji: '😎' }, // Chaud
  { max: 33,  emoji: '🌞' }, // Très chaud
  { max: Infinity, emoji: '🥵' }, // Canicule
];

/**
 * Affiche un emoji adapté à la température au centre de l'écran,
 * avec une animation pop-in puis disparition automatique.
 * @param {number} temp — température en °C
 */
const showTemperatureEmoji = (temp) => {
  const { emoji } = TEMP_EMOJIS.find(({ max }) => temp < max) || TEMP_EMOJIS.at(-1);

  const el = document.createElement('div');
  el.className = 'temp-emoji-overlay';
  el.textContent = emoji;
  document.body.appendChild(el);

  el.addEventListener('animationend', () => el.remove(), { once: true });
};

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

// Correspondance code pays ISO → langue Wikinews
const COUNTRY_WIKINEWS_LANG = {
  'FR': 'fr', 'BE': 'fr', 'CH': 'fr', 'SN': 'fr', 'CI': 'fr', 'CM': 'fr', 'MA': 'fr',
  'US': 'en', 'GB': 'en', 'AU': 'en', 'NZ': 'en', 'IE': 'en', 'CA': 'en', 'ZA': 'en',
  'DE': 'de', 'AT': 'de',
  'ES': 'es', 'MX': 'es', 'CO': 'es', 'CL': 'es', 'PE': 'es', 'AR': 'es',
  'IT': 'it', 'PT': 'pt', 'BR': 'pt',
  'NL': 'nl', 'PL': 'pl', 'RU': 'ru', 'JP': 'ja', 'CN': 'zh',
};

/**
 * Récupère les actualités récentes depuis Wikinews dans la langue du pays,
 * filtrées par le nom du pays pour n'afficher que des news pertinentes.
 * @param {string} countryCode — code ISO 2 lettres (ex: "FR", "US")
 * @param {string} countryName — nom du pays (ex: "France")
 */
const fetchCountryNews = async (countryCode, countryName) => {
  const lang = COUNTRY_WIKINEWS_LANG[countryCode] || 'fr';
  const newsCard = document.getElementById('news-card');
  const newsList = document.getElementById('news-list');

  try {
    // Wikinews : recherche des articles récents mentionnant le pays
    const url = `https://${lang}.wikinews.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(countryName)}&srnamespace=0&srlimit=8&srsort=create_timestamp_desc&format=json&origin=*`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('wikinews_error');

    const data = await response.json();
    const results = data.query && data.query.search;
    if (!results || results.length === 0) throw new Error('no_results');

    document.getElementById('news-country-name').textContent = countryName;
    newsList.innerHTML = '';

    const tmp = document.createElement('div');

    results.slice(0, 6).forEach((article) => {
      const li = document.createElement('li');
      li.className = 'news-item';

      // Texte principal : titre de l'article
      const p = document.createElement('p');
      p.textContent = article.title;
      li.appendChild(p);

      // Extrait nettoyé du HTML de Wikipedia
      if (article.snippet) {
        tmp.innerHTML = article.snippet;
        const snippetText = (tmp.textContent || '').trim();
        if (snippetText) {
          const small = document.createElement('small');
          small.className = 'news-snippet';
          small.textContent = snippetText + '…';
          li.appendChild(small);
        }
      }

      newsList.appendChild(li);
    });

    newsCard.classList.remove('hidden');
  } catch (error) {
    newsCard.classList.add('hidden');
  }
};

/**
 * Récupère une photo de la ville via l'API Wikipedia et l'affiche.
 * Si aucune image n'est disponible, masque le conteneur d'image.
 * @param {string} cityName
 */
const fetchCityImage = async (cityName) => {
  const container = document.getElementById('city-image-container');
  const img = document.getElementById('city-image');

  try {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(cityName)}`;
    const response = await fetch(url);

    if (!response.ok) {
      container.style.display = 'none';
      return;
    }

    const data = await response.json();

    if (data.originalimage) {
      img.src = data.originalimage.source;
      img.alt = `Photo de ${cityName}`;
      container.style.display = 'block';
    } else if (data.thumbnail) {
      img.src = data.thumbnail.source;
      img.alt = `Photo de ${cityName}`;
      container.style.display = 'block';
    } else {
      container.style.display = 'none';
    }
  } catch (error) {
    container.style.display = 'none';
  }
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

    const { latitude, longitude, name, country, country_code } = geoData.results[0];

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

    // Affichage météo
    document.getElementById('weather-icon').textContent = weather.icon;
    document.getElementById('weather-city').textContent = `${name}, ${country}`;
    document.getElementById('weather-temp').textContent = `${Math.round(current.temperature_2m)} °C`;
    document.getElementById('weather-desc').textContent = weather.desc;
    document.getElementById('weather-result').classList.remove('hidden');

    // Animation emoji température
    showTemperatureEmoji(Math.round(current.temperature_2m));

    // Photo de la ville (Wikipedia)
    fetchCityImage(name);

    // Actualités du pays (Wikipedia) — country_code = code ISO ex: "FR", "US"
    fetchCountryNews(country_code, country);

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
