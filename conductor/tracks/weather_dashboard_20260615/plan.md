# Plan — Dashboard Météo & Horloges

## Phase 1 : Structure HTML de base

- [x] **T1.1** — Créer `index.html` avec doctype, charset UTF-8, balises sémantiques (header, main, footer) `ce06716`
- [x] **T1.2** — Créer `style.css` et `script.js` vides, liés depuis `index.html` `ce06716`
- [x] **T1.3** — Ajouter les 3 sections dans le HTML : carte météo, carte heure France, carte heure New York `ce06716`
- [x] **T1.4** — Vérification manuelle : ouvrir `index.html` dans le navigateur, confirmer la structure de base visible `ce06716`

## Phase 2 : Style CSS dark mode

- [x] **T2.1** — Implémenter le thème dark mode global (fond, couleurs, polices) `fe9da53`
- [x] **T2.2** — Styler les 3 cartes (coins arrondis, ombre, espacement) `fe9da53`
- [x] **T2.3** — Styler le champ de recherche et le bouton météo `fe9da53`
- [x] **T2.4** — Rendre le layout responsive (flexbox/grid, mobile-first, breakpoint 768px) `fe9da53`
- [x] **T2.5** — Vérification manuelle : tester l'affichage sur desktop et en mode mobile (DevTools) `fe9da53`

## Phase 3 : Horloges en temps réel

- [ ] **T3.1** — Implémenter la fonction `updateClocks()` dans `script.js` avec `Intl.DateTimeFormat`
- [ ] **T3.2** — Afficher l'heure Paris (Europe/Paris) mise à jour chaque seconde via `setInterval`
- [ ] **T3.3** — Afficher l'heure New York (America/New_York) mise à jour chaque seconde
- [ ] **T3.4** — Vérification manuelle : confirmer que les deux horloges affichent l'heure correcte et s'actualisent

## Phase 4 : Intégration météo OpenWeatherMap

- [ ] **T4.1** — Créer la fonction `fetchWeather(city)` qui appelle l'API OpenWeatherMap
- [ ] **T4.2** — Afficher la température (°C), la description et l'icône météo dans la carte
- [ ] **T4.3** — Brancher le champ de recherche : déclencher `fetchWeather` au clic et à la touche Entrée
- [ ] **T4.4** — Gérer les erreurs : ville introuvable (404), clé invalide (401), réseau indisponible
- [ ] **T4.5** — Vérification manuelle : rechercher "Paris", "London", "fakeCity" et valider les comportements

## Phase 5 : Finalisation & Déploiement

- [ ] **T5.1** — Créer `README.md` avec description du projet et instructions pour la clé API
- [ ] **T5.2** — Créer `.gitignore` (exclure fichiers OS et éditeur)
- [ ] **T5.3** — Vérification finale : tester la page complète sur mobile (responsive) et desktop
- [ ] **T5.4** — Publier sur GitHub : créer le dépôt, pousser le code, activer GitHub Pages sur la branche `main`
