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

// Correspondance code pays ISO → portail actualités Wikipedia spécifique au pays
const COUNTRY_WIKI = {
  'FR': { lang: 'fr', page: 'Portail:France/Actualit%C3%A9s' },
  'BE': { lang: 'fr', page: 'Portail:Belgique/Actualit%C3%A9s' },
  'CH': { lang: 'fr', page: 'Portail:Suisse/Actualit%C3%A9s' },
  'CA': { lang: 'fr', page: 'Portail:Qu%C3%A9bec/Actualit%C3%A9s' },
  'SN': { lang: 'fr', page: 'Portail:S%C3%A9n%C3%A9gal/Actualit%C3%A9s' },
  'US': { lang: 'en', page: 'Portal:United_States/Current_events' },
  'GB': { lang: 'en', page: 'Portal:United_Kingdom/Current_events' },
  'AU': { lang: 'en', page: 'Portal:Australia/Current_events' },
  'DE': { lang: 'de', page: 'Portal:Deutschland/Aktuell' },
  'AT': { lang: 'de', page: 'Portal:%C3%96sterreich/Aktuell' },
  'ES': { lang: 'es', page: 'Portal:Espa%C3%B1a/Actualidad' },
  'MX': { lang: 'es', page: 'Portal:M%C3%A9xico/Actualidad' },
  'AR': { lang: 'es', page: 'Portal:Argentina/Actualidad' },
  'IT': { lang: 'it', page: 'Portale:Italia/In_primo_piano' },
  'PT': { lang: 'pt', page: 'Portal:Portugal/Atualidades' },
  'BR': { lang: 'pt', page: 'Portal:Brasil/Atualidades' },
  'JP': { lang: 'ja', page: 'Portal:%E6%97%A5%E6%9C%AC/%E6%99%82%E4%BA%8B%E5%95%8F%E9%A1%8C' },
  'CN': { lang: 'zh', page: 'Portal:%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86/%E6%96%B0%E8%81%9E' },
};

// Portail générique "actualités mondiales" utilisé si le pays n'est pas dans la liste
const FALLBACK_WIKI = { lang: 'fr', page: 'Portail:Actualit%C3%A9' };

/**
 * Récupère les actualités du portail Wikipedia spécifique au pays.
 * Extrait les <li> du contenu de la page et les affiche.
 * @param {string} countryCode — code ISO 2 lettres (ex: "FR", "US")
 * @param {string} countryName — nom du pays affiché dans le titre
 */
const fetchCountryNews = async (countryCode, countryName) => {
  const wiki = COUNTRY_WIKI[countryCode] || FALLBACK_WIKI;
  const newsCard = document.getElementById('news-card');
  const newsList = document.getElementById('news-list');

  try {
    const url = `https://${wiki.lang}.wikipedia.org/w/api.php?action=parse&page=${wiki.page}&prop=text&format=json&origin=*`;
    const response = await fetch(url);
    if (!response.ok) { newsCard.classList.add('hidden'); return; }

    const data = await response.json();
    if (!data.parse || !data.parse.text) { newsCard.classList.add('hidden'); return; }

    // Parse le HTML retourné par Wikipedia
    const tmp = document.createElement('div');
    tmp.innerHTML = data.parse.text['*'];

    // Récupère tous les <li> contenant du texte (au moins 40 caractères)
    const items = Array.from(tmp.querySelectorAll('li'))
      .map((el) => el.textContent.trim())
      .filter((text) => text.length > 40 && !text.startsWith('↑'));

    if (items.length === 0) { newsCard.classList.add('hidden'); return; }

    document.getElementById('news-country-name').textContent = countryName;
    newsList.innerHTML = '';

    items.slice(0, 6).forEach((text) => {
      const li = document.createElement('li');
      li.className = 'news-item';
      const p = document.createElement('p');
      p.textContent = text;
      li.appendChild(p);
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
