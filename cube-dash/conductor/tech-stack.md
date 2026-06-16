# Tech Stack

## Langages
- HTML5
- CSS3
- JavaScript (vanilla, sans framework)

## Rendu
- API Canvas 2D (`<canvas>` + `CanvasRenderingContext2D`) pour dessiner le joueur, le sol et les obstacles, et gérer la boucle de jeu (`requestAnimationFrame`)

## Pas de build, pas de dépendances
Aucun bundler, transpileur ou gestionnaire de paquets n'est nécessaire pour le MVP. Le projet doit pouvoir s'ouvrir directement avec `index.html` dans un navigateur, sans étape de build.

## Tests
La logique pure (physique, collisions, machine d'état, défilement) est extraite dans des fichiers `src/*.js` testés avec le test runner natif de Node.js (`node --test`), sans dépendance externe. Le rendu Canvas et le code lié au DOM ne sont pas couverts par ces tests (non testables hors navigateur sans dépendance supplémentaire) ; ils sont vérifiés manuellement.

## Déviation (2026-06-16) : scripts classiques au lieu de modules ES dans le navigateur
**Constat :** `<script type="module">` déclenche une erreur CORS dans Chrome/Edge lorsque la page est ouverte via `file://` (origine `null`), ce qui empêche `index.html` de fonctionner en ouverture directe — en contradiction avec la contrainte "pas de build, pas de serveur" ci-dessus.

**Décision :** Les fichiers `src/*.js` n'utilisent plus `export`/`import`. Ce sont des scripts classiques qui déclarent leurs fonctions dans la portée globale, chargés dans `index.html` via des balises `<script src="...">` successives (sans `type="module"`), dans l'ordre des dépendances, avant `game.js`. Pour rester testables avec `node --test` (qui utilise CommonJS par défaut sans `"type": "module"` dans `package.json`), chaque fichier `src/*.js` expose aussi ses fonctions via `module.exports`, protégé par une vérification `typeof module !== 'undefined'` qui ne s'exécute donc pas dans le navigateur.

Conséquence : `package.json` ne déclare plus `"type": "module"`, et les fichiers de test utilisent `require()` au lieu de `import`.

## Hébergement
GitHub Pages, servi directement depuis le dépôt (branche `main` ou dossier `/docs`, à préciser au moment du déploiement).

## Structure de fichiers prévue
```
cube-dash/
  index.html
  style.css
  game.js
  package.json
  src/
    gameLoop.js
  test/
    gameLoop.test.js
  conductor/
```

## Justification
Choix volontairement minimaliste : pas de framework de jeu (Phaser, etc.) afin que la physique, les collisions et la boucle de jeu soient codées et comprises directement, dans un but pédagogique. La stack n'a aucune dépendance externe, ce qui simplifie le déploiement sur GitHub Pages et la maintenance.
