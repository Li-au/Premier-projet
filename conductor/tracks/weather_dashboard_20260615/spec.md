# Spec — Dashboard Météo & Horloges

## Objectif
Créer une page web statique affichant en temps réel la météo (ville au choix), l'heure française et l'heure de New York. Déployée sur GitHub Pages.

## Fonctionnalités

### F1 — Horloges en temps réel
- Afficher l'heure actuelle à Paris (fuseau Europe/Paris)
- Afficher l'heure actuelle à New York (fuseau America/New_York)
- Mise à jour automatique chaque seconde (format HH:MM:SS)

### F2 — Météo par ville
- Champ de saisie pour entrer le nom d'une ville
- Bouton de recherche ou validation par touche Entrée
- Affichage : température (°C), description, icône météo
- Gestion des erreurs : ville introuvable, clé API manquante, réseau indisponible

### F3 — Interface
- Thème dark mode professionnel
- 3 cartes distinctes : Météo / Heure France / Heure New York
- Design responsive (mobile + desktop)
- Icône météo fournie par OpenWeatherMap

## Contraintes techniques
- Vanilla HTML/CSS/JS uniquement (aucun framework)
- API : OpenWeatherMap (clé saisie par l'utilisateur ou dans `script.js`)
- Hébergement : GitHub Pages (`index.html` à la racine)
- Pas de données sensibles dans le dépôt

## Critères d'acceptation
- [ ] Les deux horloges s'affichent et se mettent à jour chaque seconde
- [ ] La recherche d'une ville affiche les données météo correctes
- [ ] Un message d'erreur clair s'affiche si la ville est invalide
- [ ] La page s'affiche correctement sur mobile (320px minimum)
- [ ] Le projet est accessible via GitHub Pages
