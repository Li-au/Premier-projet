# Plan - MVP - Cube Dash jouable de bout en bout

Suit le workflow défini dans `conductor/workflow.md` (TDD : test rouge → implémentation → vert → commit par tâche, checkpoint de fin de phase).

Test runner : Node.js natif (`node --test`), aucune dépendance externe, conforme à `tech-stack.md`.

---

## Phase 1 — Squelette du projet et boucle de jeu `[checkpoint: 3dfb760]`

- [x] **Tâche 1.1 :** Créer la structure de fichiers (`index.html`, `style.css`, `game.js`) avec un canvas vide affiché à l'écran `[7856d83]`
- [x] **Tâche 1.2 :** Écrire les tests pour une fonction pure `createGameLoop`/`update(state, dt)` qui avance un compteur de temps (Red → Green) `[113d3ed]`
- [x] **Tâche 1.3 :** Implémenter la boucle de jeu (`requestAnimationFrame`) qui appelle `update`/`render` à chaque frame avec delta time `[16a1ca2]`

### Phase Completion Checkpoint — Phase 1

---

## Phase 2 — Physique du joueur (gravité, saut) `[checkpoint: 2728159]`

- [x] **Tâche 2.1 :** Écrire les tests pour une fonction pure `updatePlayerPhysics(player, dt, input)` : gravité appliquée en l'air, saut déclenché au sol, position clampée au sol `[0fde645]`
- [x] **Tâche 2.2 :** Implémenter `updatePlayerPhysics` `[0fde645]`
- [x] **Tâche 2.3 :** Brancher les contrôles (espace + clic) sur l'impulsion de saut `[f8a1d73]`
- [x] **Tâche 2.4 :** Dessiner le joueur (carré) et le sol sur le canvas `[a9dd8aa]`

### Phase Completion Checkpoint — Phase 2

---

## Phase 3 — Défilement et obstacles `[checkpoint: 7e15f57]`

- [x] **Tâche 3.1 :** Écrire les tests pour une fonction pure `advanceWorld(worldOffset, dt, speed)` qui fait progresser le défilement `[9c22805]`
- [x] **Tâche 3.2 :** Implémenter le défilement horizontal du décor (sol + fond) `[4cb0ee0]`
- [x] **Tâche 3.3 :** Écrire les tests pour la définition d'un niveau fixe (liste d'obstacles avec position x) et leur passage dans le référentiel écran selon `worldOffset` `[d037b29]`
- [x] **Tâche 3.4 :** Implémenter le rendu des obstacles (triangles/spikes) à l'écran selon leur position relative au défilement `[9f186ce]`

### Phase Completion Checkpoint — Phase 3

---

## Phase 4 — Collision, Game Over, redémarrage `[checkpoint: 74d4a94]`

- [x] **Tâche 4.1 :** Écrire les tests pour une fonction pure `checkCollision(player, obstacle)` (intersection rectangle/triangle approximée) `[740df09]`
- [x] **Tâche 4.2 :** Implémenter `checkCollision` et l'intégrer à la boucle (déclenche l'état `game_over`) `[88c532d]`
- [x] **Tâche 4.3 :** Écrire les tests pour la machine d'état du jeu `title → playing → game_over → playing` (sur input espace/clic) `[9e39797]`
- [x] **Tâche 4.4 :** Implémenter la machine d'état et le redémarrage instantané (réinitialisation complète de la partie) `[d9b98ec]`

### Phase Completion Checkpoint — Phase 4

---

## Phase 5 — Habillage visuel et écran titre `[checkpoint: f280659]`

- [x] **Tâche 5.1 :** Écrire les tests pour une fonction pure `getPlayerColor(elapsedTime|distance)` qui retourne une couleur progressive `[b02a915]`
- [x] **Tâche 5.2 :** Implémenter `getPlayerColor` et l'appliquer au rendu du joueur `[04cce6f]`
- [x] **Tâche 5.3 :** Implémenter l'écran titre "CUBE DASH" (police simple, invite à démarrer) conforme à `product-guidelines.md` `[13cb72b]`
- [x] **Tâche 5.4 :** Finaliser le style visuel minimaliste flat (couleurs plates, contraste obstacles/joueur/fond) sur l'ensemble des écrans `[024146f]`

### Phase Completion Checkpoint — Phase 5

---

## Phase 6 — Sélection de niveau et niveaux multiples `[checkpoint: 83e0a89]`

Extension de scope décidée le 2026-06-16 (voir `spec.md`).

- [x] **Tâche 6.1 :** Écrire les tests pour la définition de 5 niveaux fixes (`LEVELS`, agencements d'obstacles différents, vitesse et espacement progressifs) et une fonction `getLevel(id)` `[d7b9609]`
- [x] **Tâche 6.2 :** Implémenter `LEVELS` (5 niveaux à difficulté progressive) et `getLevel(id)` `[d7b9609]`
- [x] **Tâche 6.3 :** Écrire les tests pour l'extension de la machine d'état (`title → level_select → playing`, `LEVEL_SELECTED` avec un id de niveau) `[013e189]`
- [x] **Tâche 6.4 :** Implémenter l'extension de la machine d'état et le branchement du niveau choisi dans `game.js` (vitesse/obstacles dépendent du niveau sélectionné) `[6e66c26]`
- [x] **Tâche 6.5 :** Écrire les tests pour une fonction pure de disposition de la grille de sélection (`getLevelGridLayout(numLevels, screenWidth)` → positions des cases) `[ea0bd93]`
- [x] **Tâche 6.6 :** Implémenter le rendu de l'écran de sélection (grille de 5 cases numérotées, style flat minimaliste) et la détection du clic sur une case `[c0fad7a]`
- [x] **Tâche 6.7 :** Ajouter une option de pause pendant la partie (touche Échap) permettant de revenir à l'écran de sélection de niveau `[fe20fd4]`

### Phase Completion Checkpoint — Phase 6

---

## Phase 7 — Plateformes flottantes et blocs solides `[checkpoint: 7ada814]`

Extension de scope décidée le 2026-06-16 (voir `spec.md`) : niveaux avec du relief façon Geometry Dash (plateformes en hauteur à atteindre en sautant, blocs solides pouvant aussi servir d'obstacles mortels).

- [x] **Tâche 7.1 :** Écrire les tests pour `resolvePlayerPhysics(player, dt, input, platforms)` : atterrissage sur la plateforme la plus proche en dessous, sol toujours présent comme filet de sécurité, perte d'appui en quittant une plateforme (chute) `[0e5220e]`
- [x] **Tâche 7.2 :** Implémenter `resolvePlayerPhysics` (remplace `updatePlayerPhysics`) et mettre à jour `game.js` `[1b66499]`
- [x] **Tâche 7.3 :** Écrire les tests pour la définition de plateformes dans un niveau (`level.platforms`) et leur passage en coordonnées écran (réutilise `getVisibleObstacles`, déjà générique) `[5105c45]`
- [x] **Tâche 7.4 :** Implémenter le rendu des plateformes (rectangles flat, distincts du sol/joueur/obstacles) et calculer les plateformes visibles à passer à `resolvePlayerPhysics` dans `game.js` `[05284a8]`
- [x] **Tâche 7.5 :** Écrire les tests pour les obstacles de type "bloc" (rectangle mortel, en plus des spikes triangulaires) `[9c3e107]`
- [x] **Tâche 7.6 :** Implémenter le rendu des blocs-obstacles et les inclure dans la détection de collision mortelle `[58445c9]`
- [x] **Tâche 7.7 :** Enrichir les 5 niveaux avec des sections plateformes/escaliers et quelques blocs-obstacles `[9bd9e54]`
- [x] **Tâche 7.8 :** Vérification manuelle complète et ajustements de gameplay (hauteur de saut cohérente avec les plateformes, espacement jouable) `[verified]`

### Phase Completion Checkpoint — Phase 7

---

## Phase 8 — Plus d'obstacles et fin de niveau

Extension de scope décidée le 2026-06-16 (voir `spec.md`).

- [x] **Tâche 8.1 :** Écrire les tests pour `hasReachedFinish(worldOffset, finishX, playerX)` (ligne d'arrivée d'un niveau) `[97cf3a2]`
- [x] **Tâche 8.2 :** Implémenter `hasReachedFinish` et ajouter un `finishX` à chaque niveau `[97cf3a2]`
- [x] **Tâche 8.3 :** Écrire les tests pour l'extension de la machine d'état (`playing → level_complete` sur `LEVEL_COMPLETE`, `level_complete → level_select` sur `ACTION_PRESSED`) `[0a6fdfc]`
- [x] **Tâche 8.4 :** Implémenter l'extension de la machine d'état, le déclenchement de la fin de niveau dans `game.js` et l'écran "Niveau terminé" `[ec2b19d]`
- [ ] **Tâche 8.5 :** Enrichir tous les niveaux avec davantage d'obstacles (spikes/blocs supplémentaires, plus de variété)
- [ ] **Tâche 8.6 :** Vérification manuelle complète sur les 5 niveaux (densité d'obstacles, fin de niveau atteignable et claire)

### Phase Completion Checkpoint — Phase 8

---

## Phase 9 — Déploiement

- [ ] **Tâche 9.1 :** Vérifier que le jeu fonctionne en ouverture directe de `index.html` (file://) sans erreur console
- [ ] **Tâche 9.2 :** Configurer et déployer sur GitHub Pages, vérifier l'accès via le lien public

### Phase Completion Checkpoint — Phase 9
