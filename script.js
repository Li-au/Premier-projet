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

// ===== Effets visuels météo =====

let _effectTimer = null;

const clearEffect = () => {
  clearInterval(_effectTimer);
  _effectTimer = null;
  document.querySelectorAll('.flame, .wx-snow, .wx-wind, .wx-bubble').forEach((el) => el.remove());
};

const createFlame = (minW, maxW) => {
  const el = document.createElement('div');
  el.className = 'flame';
  const w = minW + Math.random() * maxW;
  el.style.width = `${w}px`;
  el.style.height = `${w * (2.8 + Math.random())}px`;
  el.style.left = `${Math.random() * 98}vw`;
  el.style.animationName = 'flame-rise';
  el.style.animationDuration = `${1.3 + Math.random() * 1.3}s`;
  el.style.animationTimingFunction = 'ease-out';
  el.style.animationFillMode = 'forwards';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
};

const spawnFlame = () => createFlame(22, 38);
const spawnBigFlame = () => createFlame(36, 65);

const SNOWFLAKE_CHARS = ['❄', '❅', '❆'];

const spawnSnowflake = () => {
  const el = document.createElement('div');
  el.className = 'wx-snow';
  el.textContent = SNOWFLAKE_CHARS[Math.floor(Math.random() * 3)];
  el.style.fontSize = `${10 + Math.random() * 18}px`;
  el.style.left = `${Math.random() * 100}vw`;
  el.style.setProperty('--drift', `${(Math.random() - 0.5) * 130}px`);
  el.style.setProperty('--spin', `${(Math.random() < 0.5 ? 1 : -1) * (90 + Math.random() * 270)}deg`);
  el.style.animationName = 'snow-fall';
  el.style.animationDuration = `${3.5 + Math.random() * 4}s`;
  el.style.animationTimingFunction = 'linear';
  el.style.animationFillMode = 'forwards';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
};

const spawnWind = () => {
  const el = document.createElement('div');
  el.className = 'wx-wind';
  el.style.top = `${10 + Math.random() * 80}vh`;
  el.style.width = `${80 + Math.random() * 200}px`;
  el.style.animationName = 'wind-streak';
  el.style.animationDuration = `${0.7 + Math.random() * 0.8}s`;
  el.style.animationTimingFunction = 'ease-in-out';
  el.style.animationFillMode = 'forwards';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
};

const spawnBubble = () => {
  const el = document.createElement('div');
  el.className = 'wx-bubble';
  const size = 6 + Math.random() * 14;
  el.style.width = `${size}px`;
  el.style.height = `${size}px`;
  el.style.left = `${Math.random() * 98}vw`;
  el.style.setProperty('--sway', `${(Math.random() - 0.5) * 60}px`);
  el.style.animationName = 'bubble-rise';
  el.style.animationDuration = `${2.5 + Math.random() * 2}s`;
  el.style.animationTimingFunction = 'ease-in-out';
  el.style.animationFillMode = 'forwards';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove(), { once: true });
};

const EFFECT_CONFIG = {
  'temp-glacial':    { fn: spawnSnowflake, burst: 10, burstDelay: 110, interval: 350, perTick: [2, 4] },
  'temp-froid':      { fn: spawnSnowflake, burst: 5,  burstDelay: 200, interval: 650, perTick: [1, 3] },
  'temp-frais':      { fn: spawnWind,      burst: 3,  burstDelay: 320, interval: 950, perTick: [1, 2] },
  'temp-doux':       { fn: spawnBubble,    burst: 5,  burstDelay: 170, interval: 800, perTick: [1, 2] },
  'temp-chaud':      { fn: spawnFlame,     burst: 7,  burstDelay: 100, interval: 650, perTick: [2, 4] },
  'temp-tres-chaud': { fn: spawnBigFlame,  burst: 25, burstDelay: 40,  interval: 220, perTick: [6, 9] },
};

const startEffect = (cls) => {
  clearEffect();
  const cfg = EFFECT_CONFIG[cls];
  if (!cfg) return;
  for (let i = 0; i < cfg.burst; i++) setTimeout(cfg.fn, i * cfg.burstDelay);
  _effectTimer = setInterval(() => {
    const [min, max] = cfg.perTick;
    const n = min + Math.floor(Math.random() * (max - min + 1));
    for (let i = 0; i < n; i++) setTimeout(cfg.fn, i * 130);
  }, cfg.interval);
};

// ===== Emoji température =====

const TEMP_EMOJIS = [
  { max: -25, emoji: '☠️',  cls: 'temp-glacial'    },
  { max: -15, emoji: '🌨️', cls: 'temp-glacial'    },
  { max: -10, emoji: '🧊',  cls: 'temp-glacial'    },
  { max: -5,  emoji: '🥶',  cls: 'temp-glacial'    },
  { max: 0,   emoji: '❄️',  cls: 'temp-glacial'    },
  { max: 3,   emoji: '🧥',  cls: 'temp-froid'      },
  { max: 6,   emoji: '🌧️', cls: 'temp-froid'      },
  { max: 8,   emoji: '🌫️', cls: 'temp-froid'      },
  { max: 10,  emoji: '🌬️', cls: 'temp-frais'      },
  { max: 13,  emoji: '🍃',  cls: 'temp-frais'      },
  { max: 15,  emoji: '🌥️', cls: 'temp-frais'      },
  { max: 18,  emoji: '😊',  cls: 'temp-doux'       },
  { max: 20,  emoji: '🌸',  cls: 'temp-doux'       },
  { max: 22,  emoji: '🍀',  cls: 'temp-doux'       },
  { max: 24,  emoji: '😎',  cls: 'temp-doux'       },
  { max: 26,  emoji: '☀️',  cls: 'temp-doux'       },
  { max: 29,  emoji: '🌞',  cls: 'temp-chaud'      },
  { max: 32,  emoji: '🏖️', cls: 'temp-chaud'      },
  { max: 35,  emoji: '🔥',  cls: 'temp-chaud'      },
  { max: 38,  emoji: '🥵',  cls: 'temp-tres-chaud' },
  { max: 42,  emoji: '🌋',  cls: 'temp-tres-chaud' },
  { max: Infinity, emoji: '💀', cls: 'temp-tres-chaud' },
];

const TEMP_CLASSES = ['temp-glacial', 'temp-froid', 'temp-frais', 'temp-doux', 'temp-chaud', 'temp-tres-chaud'];

/**
 * Affiche un emoji adapté à la température dans la carte météo,
 * change la couleur de fond de la carte, et retire l'emoji après l'animation.
 * @param {number} temp — température en °C
 */
const showTemperatureEmoji = (temp) => {
  const match = TEMP_EMOJIS.find(({ max }) => temp < max) || TEMP_EMOJIS.at(-1);

  // Couleur de fond de la page entière
  TEMP_CLASSES.forEach((c) => document.body.classList.remove(c));
  document.body.classList.add(match.cls);

  startEffect(match.cls);

  // Emoji animé — positionné en fixed par rapport à la carte météo
  const card = document.getElementById('weather-card');
  const rect = card.getBoundingClientRect();
  const el = document.createElement('div');
  el.className = 'temp-emoji-overlay';
  el.textContent = match.emoji;
  el.style.right = `${window.innerWidth - rect.right + 24}px`;
  el.style.top = `${rect.top + rect.height / 2}px`;
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
 * Efface les messages d'erreur, les résultats météo et les suggestions.
 */
const clearWeatherDisplay = () => {
  document.getElementById('weather-error').classList.add('hidden');
  document.getElementById('weather-result').classList.add('hidden');
  document.getElementById('suggestions-container').classList.add('hidden');
  clearEffect();
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
 * Affiche la météo à partir d'un résultat de géocodage déjà résolu.
 * @param {{ latitude, longitude, name, country, country_code }} geoResult
 */
const fetchWeatherByCoords = async ({ latitude, longitude, name, country, country_code }) => {
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

  document.getElementById('weather-icon').textContent = weather.icon;
  document.getElementById('weather-city').textContent = `${name}, ${country}`;
  document.getElementById('weather-temp').textContent = `${Math.round(current.temperature_2m)} °C`;
  document.getElementById('weather-desc').textContent = weather.desc;
  document.getElementById('weather-result').classList.remove('hidden');

  showTemperatureEmoji(Math.round(current.temperature_2m));
  fetchCityImage(name);
};

/**
 * Affiche des boutons de suggestion pour les résultats alternatifs du géocodage.
 * @param {Array} results — tableau complet des résultats Open-Meteo
 * @param {object} selectedResult — résultat déjà affiché (à exclure des suggestions)
 */
const showSuggestions = (results, selectedResult) => {
  const container = document.getElementById('suggestions-container');
  const list = document.getElementById('suggestions-list');

  const seenCountries = new Set([selectedResult.country_code]);
  const alternatives = results.filter((r) => {
    if (r === selectedResult) return false;
    if (seenCountries.has(r.country_code)) return false;
    seenCountries.add(r.country_code);
    return true;
  });
  if (alternatives.length === 0) {
    container.classList.add('hidden');
    return;
  }

  list.innerHTML = '';
  alternatives.forEach((result) => {
    const btn = document.createElement('button');
    btn.className = 'suggestion-btn';
    const region = result.admin1 ? `${result.admin1}, ` : '';
    btn.textContent = `${result.name} (${region}${result.country})`;
    btn.addEventListener('click', () => {
      document.getElementById('city-input').value = result.name;
      container.classList.add('hidden');
      document.getElementById('weather-result').classList.add('hidden');
      fetchWeatherByCoords(result);
    });
    list.appendChild(btn);
  });

  container.classList.remove('hidden');
};

/**
 * Trie les résultats de géocodage par pertinence :
 * - bonus fort si le nom de la ville COMMENCE par l'input (lettre(s) oubliée(s) en fin)
 * - bonus moyen si l'input correspond exactement à un nom moins connu
 * - population comme départager final (grande ville → plus probable)
 * @param {string} input
 * @param {Array}  results
 */
const rankResults = (input, results) => {
  const a = input.trim().toLowerCase();
  return [...results].sort((r1, r2) => {
    const score = (r) => {
      const b = r.name.toLowerCase();
      const pop = r.population || 0;
      if (b === a)          return pop + 600_000;
      if (b.startsWith(a)) return pop + 1_200_000;
      return pop;
    };
    return score(r2) - score(r1);
  });
};

/**
 * Géocode la ville saisie (jusqu'à 10 résultats), trie par pertinence,
 * affiche la météo du meilleur résultat et propose les autres comme suggestions.
 * @param {string} city
 */
const fetchWeather = async (city) => {
  const trimmedCity = city.trim();
  if (!trimmedCity) return;

  clearWeatherDisplay();
  const input = document.getElementById('city-input');
  input.disabled = true;

  try {
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmedCity)}&count=10&language=fr&format=json`;
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

    const results = rankResults(trimmedCity, geoData.results);
    const topResult = results[0];
    await fetchWeatherByCoords(topResult);
    showSuggestions(results, topResult);

  } catch (error) {
    showWeatherError('Impossible de contacter le serveur. Vérifiez votre connexion internet.');
  } finally {
    input.disabled = false;
    input.focus();
  }
};

// ===== Événements =====


document.getElementById('city-input').addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    fetchWeather(document.getElementById('city-input').value);
  }
});
