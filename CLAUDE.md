# CLAUDE.md — balinaisa-pz (front)

Contexte technique pour travailler sur ce repo. **Public** : ne contient que le
front. Le backend, la config et le contexte projet vivent dans un **repo privé
séparé** (`balinaisa-assets`) — s'y référer pour tout ce qui n'est pas le site.

## Ce repo
Site statique du simulateur d'extérieur Balinaisa, servi par **GitHub Pages**
(`https://charlusminus.github.io/balinaisa-pz/`). Aucun build : HTML/CSS/JS purs.

```
index.html     — wizard (Photo → Coordonnées → Confirmation)
styles.css     — design system
simulator.js   — logique UI + envoi du lead au webhook n8n
embed.js       — snippet à coller sur balinaisa.com
result.html    — page de rendu
```

## Déploiement
Push sur `main` = mise en ligne (Pages, source `main` / root).

## Notes techniques
- Le front **POST le lead en `application/json`** au webhook n8n (voir `simulator.js`).
  ⚠️ Ne pas utiliser `mode:'no-cors'` : ça force `text/plain` et le backend ne parse plus le body.
- La photo est **redimensionnée côté client** (~1200px, JPEG 0.85) avant envoi.
- Toute la suite (traitement du lead, IA, emails) se passe **hors de ce repo**, dans le flow n8n (automation).

## Règles
- **Aucune clé / secret dans ce repo** (il est public).
- Ne pas mettre ici de contexte business, tarifaire ou stratégique.
- Changements **front** → ici. Flow backend, docs, assets → repo privé `balinaisa-assets`.
