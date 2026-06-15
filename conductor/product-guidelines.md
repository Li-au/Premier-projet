# Product Guidelines — Weather & Time Dashboard

## Style visuel
- **Thème :** Dashboard professionnel, dark mode avec accents colorés
- **Palette :** Fond sombre (#1a1a2e), cartes légèrement plus claires (#16213e), accents bleu/cyan (#0f3460, #00b4d8)
- **Typographie :** Police sans-serif moderne (ex: Inter, Poppins ou system-ui)
- **Icônes météo :** Animées via CSS ou bibliothèque légère (ex: Weather Icons)
- **Cartes :** Coins arrondis, légère ombre portée, espacement généreux

## Expérience utilisateur (UX)
- La page charge directement avec les horloges actives (pas d'étape d'accueil)
- La recherche de ville est visible immédiatement, centrée en haut
- Les résultats météo s'affichent sans rechargement de page
- Messages d'erreur clairs si la ville est introuvable ou si l'API échoue
- Design responsive : utilisable sur mobile et desktop

## Ton et contenu
- Interface en français
- Labels courts et directs : "Paris", "New York", "Météo à [ville]"
- Pas de jargon technique visible pour l'utilisateur

## Code et qualité
- Code commenté en français pour faciliter la relecture
- Nommage des variables en anglais (bonnes pratiques)
- Fichiers séparés : `index.html`, `style.css`, `script.js`
- Aucune dépendance externe obligatoire (vanilla JS uniquement)

## GitHub Pages
- `index.html` à la racine du dépôt
- `README.md` expliquant le projet et comment obtenir une clé API
- Pas de données sensibles dans le code (clé API gérée par l'utilisateur)
