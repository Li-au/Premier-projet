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

## Extension de scope (2026-06-16) : plateformes flottantes et blocs solides

Décidé en cours de track : le terrain n'est plus uniquement un sol plat avec des spikes. Les niveaux peuvent inclure :

- Des **plateformes flottantes** à différentes hauteurs, sur lesquelles le joueur atterrit en sautant (avec du vide en dessous/au-dessus, contrairement à un simple changement de hauteur du sol)
- Des **blocs solides au sol** : visuellement des rectangles (au lieu des triangles des spikes), qu'on doit escalader en sautant dessus avant d'y arriver. Ils ne sont pas mortels au contact du dessus (le joueur peut se poser dessus comme sur une plateforme), mais une collision sur le côté/dessous (le joueur ne sautant pas à temps) déclenche un Game Over, exactement comme un spike

Cela nécessite de généraliser la physique du joueur (`resolvePlayerPhysics`, anciennement `updatePlayerPhysics`) pour qu'elle résolve l'atterrissage sur la plateforme la plus proche en dessous du joueur (en plus du sol, toujours présent comme filet de sécurité), plutôt que sur une seule hauteur de sol fixe. Les blocs solides contribuent à la fois à la liste des plateformes (pour l'atterrissage) et à la liste des obstacles (pour la détection de collision mortelle) ; le comportement "safe si posé dessus, mortel sinon" émerge naturellement de ces deux mécanismes combinés, sans logique de collision spécifique supplémentaire.

## Extension de scope (2026-06-16) : davantage d'obstacles et fin de niveau

Décidé en cours de track : chaque niveau a désormais une fin explicite (ligne d'arrivée), au lieu de continuer indéfiniment, et contient plus d'obstacles que la version initiale.

- Chaque niveau a une position de fin (`finishX`) après son dernier obstacle
- Atteindre cette position déclenche un état "Niveau terminé", avec un écran dédié
- Depuis cet écran, l'espace/clic ramène à la sélection de niveau (pas de progression automatique au niveau suivant pour le MVP)

## Extension de scope (2026-06-16) : niveaux plus longs et barre de progression

Décidé en cours de track :

- Une barre de progression s'affiche en haut de l'écran pendant le jeu, indiquant le pourcentage d'avancement vers la fin du niveau (`finishX`)
- Tous les niveaux sont allongés (davantage d'obstacles, parcours plus long), en conservant la garantie d'équité physique des écarts entre obstacles déjà établie

## Hors scope

- Éditeur de niveaux
- Retour à la sélection de niveau après un Game Over (relance le même niveau)
- Progression automatique au niveau suivant après une fin de niveau (retour à la sélection)
- Collision par le dessous/les côtés d'une plateforme (le joueur ne peut interagir qu'avec le dessus d'une plateforme ; passer dessous ou la traverser latéralement ne déclenche pas de collision spécifique)
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
