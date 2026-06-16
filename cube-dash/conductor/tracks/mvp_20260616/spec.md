# Spec - MVP - Cube Dash jouable de bout en bout

## Objectif

Livrer une version jouable, de bout en bout, de Cube Dash : écran titre → gameplay (gravité, saut, défilement, obstacles) → mort au contact → redémarrage instantané. Le jeu doit être ouvrable directement via `index.html` (aucune dépendance, aucun build) et déployable sur GitHub Pages.

## Portée fonctionnelle

Reprend l'intégralité des user stories de `conductor/requirements.md` :

1. Écran titre "CUBE DASH" avec invite à démarrer (espace/clic)
2. Personnage (carré) soumis à la gravité, posé sur le sol par défaut
3. Saut au clic/espace (impulsion verticale)
4. Défilement horizontal du décor (sol + fond), donnant l'illusion d'avancée constante
5. Obstacles fixes (spikes triangulaires), positions codées en dur pour un seul niveau
6. Détection de collision joueur/obstacle → Game Over instantané
7. Redémarrage instantané au clic/espace après Game Over
8. Couleur du joueur qui évolue progressivement (en fonction du temps écoulé/distance)

## Extension de scope (2026-06-16) : sélection de niveau

Décidé en cours de track, avant le déploiement : ajout d'un écran de sélection de niveau façon Geometry Dash et de 5 niveaux fixes au lieu d'un seul.

- Après l'écran titre, un écran de sélection affiche une grille de 5 cases numérotées (1 à 5)
- Cliquer sur une case lance le niveau correspondant
- Les 5 niveaux ont des agencements d'obstacles différents et une difficulté progressive (vitesse de défilement croissante, espacement des obstacles décroissant du niveau 1 au niveau 5)
- Après un Game Over, l'espace/clic relance le **même niveau** depuis le début (pas de retour automatique à la sélection pour le MVP)

## Hors scope

- Éditeur de niveaux
- Retour à la sélection de niveau après un Game Over (relance le même niveau)
- Musique synchronisée, power-ups
- Score persistant / leaderboard

## Architecture technique

Conforme à `conductor/tech-stack.md` :
- `index.html` : structure de la page, balise `<canvas>`
- `style.css` : mise en page minimale (centrage du canvas, fond de page)
- `game.js` : toute la logique (boucle de jeu, état, physique, rendu, collisions)
- Aucun module/bundler : un seul fichier JS chargé en `<script>` classique ou `type="module"` si besoin de séparer en plusieurs fichiers internes

## Approche de test

Le projet est un jeu Canvas sans backend ni DOM complexe. Les tests automatisés porteront sur la **logique pure, indépendante du rendu** : physique (gravité/saut), détection de collision, état du jeu (transition title → playing → game over → restart), et progression de couleur. Ces fonctions seront extraites dans des modules testables séparément du code de rendu Canvas, et testées avec un test runner JS sans dépendance lourde (à préciser en plan : ex. exécution via Node avec `assert` natif, pour respecter "pas de dépendances").

## Critères d'acceptation

- Ouvrir `index.html` dans un navigateur affiche l'écran titre
- Appuyer sur espace ou cliquer démarre la partie
- Le joueur tombe, peut sauter, le décor défile
- Toucher un spike déclenche un Game Over immédiat
- Espace/clic après Game Over relance la partie depuis le début
- La couleur du joueur change visiblement au cours d'une partie
- Le jeu est jouable sans erreur console, sans étape de build
