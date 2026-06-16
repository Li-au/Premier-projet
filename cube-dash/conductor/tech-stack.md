# Tech Stack

## Langages
- HTML5
- CSS3
- JavaScript (vanilla, sans framework)

## Rendu
- API Canvas 2D (`<canvas>` + `CanvasRenderingContext2D`) pour dessiner le joueur, le sol et les obstacles, et gérer la boucle de jeu (`requestAnimationFrame`)

## Pas de build, pas de dépendances
Aucun bundler, transpileur ou gestionnaire de paquets n'est nécessaire pour le MVP. Le projet doit pouvoir s'ouvrir directement avec `index.html` dans un navigateur, sans étape de build.

## Hébergement
GitHub Pages, servi directement depuis le dépôt (branche `main` ou dossier `/docs`, à préciser au moment du déploiement).

## Structure de fichiers prévue
```
cube-dash/
  index.html
  style.css
  game.js
  conductor/
```

## Justification
Choix volontairement minimaliste : pas de framework de jeu (Phaser, etc.) afin que la physique, les collisions et la boucle de jeu soient codées et comprises directement, dans un but pédagogique. La stack n'a aucune dépendance externe, ce qui simplifie le déploiement sur GitHub Pages et la maintenance.
