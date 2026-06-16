# Requirements - MVP

## User Stories

1. En tant que joueur, je vois un écran titre "CUBE DASH" avec une invite à appuyer sur une touche/cliquer pour démarrer la partie.
2. En tant que joueur, mon personnage (carré) tombe sous l'effet de la gravité et reste posé sur le sol par défaut.
3. En tant que joueur, je peux appuyer sur une touche (espace) ou cliquer pour faire sauter le personnage.
4. En tant que joueur, je vois le décor (sol, fond) défiler horizontalement, donnant l'illusion que le personnage avance constamment vers la droite.
5. En tant que joueur, je rencontre des obstacles (spikes triangulaires) positionnés sur le parcours, que je dois éviter en sautant au bon moment.
6. En tant que joueur, si mon personnage touche un obstacle, la partie se termine immédiatement (Game Over) et je peux relancer instantanément (espace/clic).
7. En tant que joueur, je vois la couleur de mon personnage changer progressivement pendant la partie (effet visuel dynamique).

## Fonctionnalités clés (MVP)

- Boucle de jeu (`requestAnimationFrame`) avec gestion du temps (delta time)
- Physique simple : gravité + saut (vélocité verticale)
- Génération d'obstacles : un niveau fixe codé en dur (positions des spikes)
- Détection de collision (carré vs triangle, approximée par rectangles/zones)
- Écran titre + état "Game Over" + redémarrage instantané
- Rendu Canvas 2D : sol, fond, joueur, obstacles, texte (titre/game over)
- Changement de couleur du joueur basé sur le temps écoulé ou la distance parcourue

## Contraintes

- Pas de dépendances externes, pas de build (cf. tech-stack.md)
- Doit fonctionner en ouvrant directement `index.html`, et être déployable sur GitHub Pages
- Contrôles : une seule touche (espace) + clic souris pour sauter / démarrer / relancer
- Style visuel minimaliste flat (cf. product-guidelines.md)

## Hors scope (MVP)

- Éditeur de niveaux, plusieurs niveaux
- Musique synchronisée, power-ups, score persistant/leaderboard
