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

## Phase 2 — Physique du joueur (gravité, saut)

- [x] **Tâche 2.1 :** Écrire les tests pour une fonction pure `updatePlayerPhysics(player, dt, input)` : gravité appliquée en l'air, saut déclenché au sol, position clampée au sol `[0fde645]`
- [x] **Tâche 2.2 :** Implémenter `updatePlayerPhysics` `[0fde645]`
- [x] **Tâche 2.3 :** Brancher les contrôles (espace + clic) sur l'impulsion de saut `[f8a1d73]`
- [x] **Tâche 2.4 :** Dessiner le joueur (carré) et le sol sur le canvas `[a9dd8aa]`

### Phase Completion Checkpoint — Phase 2

---

## Phase 3 — Défilement et obstacles

- [ ] **Tâche 3.1 :** Écrire les tests pour une fonction pure `advanceWorld(worldOffset, dt, speed)` qui fait progresser le défilement
- [ ] **Tâche 3.2 :** Implémenter le défilement horizontal du décor (sol + fond)
- [ ] **Tâche 3.3 :** Écrire les tests pour la définition d'un niveau fixe (liste d'obstacles avec position x) et leur passage dans le référentiel écran selon `worldOffset`
- [ ] **Tâche 3.4 :** Implémenter le rendu des obstacles (triangles/spikes) à l'écran selon leur position relative au défilement

### Phase Completion Checkpoint — Phase 3

---

## Phase 4 — Collision, Game Over, redémarrage

- [ ] **Tâche 4.1 :** Écrire les tests pour une fonction pure `checkCollision(player, obstacle)` (intersection rectangle/triangle approximée)
- [ ] **Tâche 4.2 :** Implémenter `checkCollision` et l'intégrer à la boucle (déclenche l'état `game_over`)
- [ ] **Tâche 4.3 :** Écrire les tests pour la machine d'état du jeu `title → playing → game_over → playing` (sur input espace/clic)
- [ ] **Tâche 4.4 :** Implémenter la machine d'état et le redémarrage instantané (réinitialisation complète de la partie)

### Phase Completion Checkpoint — Phase 4

---

## Phase 5 — Habillage visuel et écran titre

- [ ] **Tâche 5.1 :** Écrire les tests pour une fonction pure `getPlayerColor(elapsedTime|distance)` qui retourne une couleur progressive
- [ ] **Tâche 5.2 :** Implémenter `getPlayerColor` et l'appliquer au rendu du joueur
- [ ] **Tâche 5.3 :** Implémenter l'écran titre "CUBE DASH" (police simple, invite à démarrer) conforme à `product-guidelines.md`
- [ ] **Tâche 5.4 :** Finaliser le style visuel minimaliste flat (couleurs plates, contraste obstacles/joueur/fond) sur l'ensemble des écrans

### Phase Completion Checkpoint — Phase 5

---

## Phase 6 — Déploiement

- [ ] **Tâche 6.1 :** Vérifier que le jeu fonctionne en ouverture directe de `index.html` (file://) sans erreur console
- [ ] **Tâche 6.2 :** Configurer et déployer sur GitHub Pages, vérifier l'accès via le lien public

### Phase Completion Checkpoint — Phase 6
