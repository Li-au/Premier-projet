# Initial Concept

Créer un jeu vidéo dans le style de Geometry Dash : un carré qui court automatiquement vers la droite, doit sauter par-dessus des obstacles (spikes), et meurt au premier contact pour repartir du début. Le but premier est d'apprendre à utiliser Claude Code sur un vrai projet, et de produire un résultat visuellement impressionnant à montrer à des maîtres de stage. Le projet doit être hébergé sur GitHub (et jouable via GitHub Pages, donc 100% web).

# Product Guide

## Vision
Cube Dash est un jeu d'arcade 2D inspiré de Geometry Dash, jouable directement dans le navigateur sans installation. L'objectif est double : offrir une démo courte mais "wow" (rythme, réactivité, effets visuels) et servir de support d'apprentissage pour comprendre les mécaniques fondamentales du développement de jeu (boucle de jeu, physique, collisions, rendu).

## Public cible
- Le développeur lui-même (apprentissage du game dev et de Claude Code)
- Toute personne avec un navigateur et un lien (démonstration rapide, ex. maîtres de stage)

## Objectifs du MVP
1. Un personnage (carré) qui tombe sous l'effet de la gravité et peut sauter
2. Un défilement horizontal donnant l'impression que le personnage avance
3. Des obstacles (triangles/spikes) qui apparaissent et doivent être évités
4. Une détection de collision : tout contact avec un obstacle déclenche un "Game Over" et un restart immédiat (espace/clic)
5. Un minimum de style visuel (couleurs, légère animation) pour donner un effet soigné

## Hors scope (pour l'instant)
- Éditeur de niveaux
- Musique synchronisée au rythme
- Plusieurs formes de joueur / power-ups
- Système de score persistant / leaderboard
- Niveaux multiples (un seul niveau codé "en dur" pour le MVP)

## Critère de succès
Le jeu tourne dans un navigateur via un simple lien GitHub Pages, est jouable au clavier/souris, et donne une impression de fluidité et de "polish" malgré sa simplicité technique.
