# Cube Dash

Jeu d'arcade 2D inspiré de Geometry Dash : un carré qui court automatiquement vers la droite, doit sauter par-dessus des obstacles, et meurt au premier contact pour repartir du début.

**Démo :** [Voir sur GitHub Pages](https://li-au.github.io/Premier-projet/cube-dash/)

## Fonctionnalités

- Écran titre, sélection de niveau (grille cliquable) et menu pause
- 5 niveaux à difficulté progressive (vitesse, densité d'obstacles)
- Physique de saut avec gravité, plateformes flottantes et blocs à escalader
- Spikes et blocs mortels, avec garantie d'équité physique (aucun écart entre obstacles n'est impossible à franchir)
- Fin de niveau avec barre de progression
- Couleur du joueur évolutive, décor animé (parallaxe, soleil, collines)

## Technologies

- HTML5 / CSS3 / JavaScript vanilla (scripts classiques, sans bundler ni framework)
- Rendu via l'API Canvas 2D
- Tests automatisés avec le test runner natif de Node.js (`node --test`), sans dépendance externe
- Hébergement : GitHub Pages

## Lancer le projet

Ouvrez simplement `index.html` dans votre navigateur. Aucune installation requise.

## Lancer les tests

```bash
npm test
```

## Auteur

Projet réalisé dans le cadre d'un stage, pour apprendre à utiliser Claude Code sur un vrai projet.
