# Dashboard Météo & Horloges

Page web affichant en temps réel la météo d'une ville au choix, l'heure de Paris et l'heure de New York.

**Démo :** [Voir sur GitHub Pages](#) *(lien à mettre à jour après déploiement)*

## Fonctionnalités

- Météo en temps réel (température, description, icône) via OpenWeatherMap
- Horloge Paris (Europe/Paris) mise à jour chaque seconde
- Horloge New York (America/New_York) mise à jour chaque seconde
- Recherche de ville par nom
- Design dark mode responsive (mobile & desktop)

## Technologies

- HTML5 / CSS3 / JavaScript vanilla
- [OpenWeatherMap API](https://openweathermap.org/api) (plan gratuit)
- Hébergement : GitHub Pages

## Installation et configuration

### 1. Obtenir une clé API gratuite

1. Créez un compte sur [openweathermap.org](https://openweathermap.org)
2. Allez dans **My API Keys** et copiez votre clé
3. Les clés gratuites peuvent prendre quelques minutes à être activées

### 2. Configurer la clé API

Ouvrez `script.js` et remplacez la valeur de `API_KEY` :

```js
const API_KEY = 'votre_cle_api_ici';
```

### 3. Lancer le projet

Ouvrez simplement `index.html` dans votre navigateur. Aucune installation requise.

## Déploiement sur GitHub Pages

1. Créez un dépôt GitHub
2. Poussez le code sur la branche `main`
3. Dans **Settings > Pages**, sélectionnez la branche `main` comme source
4. Votre site sera disponible à `https://<votre-username>.github.io/<nom-du-repo>/`

## Auteur

Projet réalisé dans le cadre d'un stage — premier projet web.
