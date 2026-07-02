# Balinaisa — Simulateur d'extérieur IA

Front du simulateur de homestaging extérieur pour Balinaisa (mobilier teck), propulsé par Paktiz.
Ce repo ne contient que le **site statique** servi par GitHub Pages.

> **Backend & IP** (flow Activepieces, guide de déploiement, brief de l'agent IA) :
> repo privé [`balinaisa-assets`](https://github.com/charlusminus/balinaisa-assets).

## Structure

```
index.html     — page principale (wizard : Photo → Coordonnées → Confirmation)
styles.css     — design system
simulator.js   — logique UI + envoi du lead au webhook Activepieces
embed.js       — snippet à coller sur balinaisa.com
result.html    — page de rendu
```

## Déploiement GitHub Pages

1. Push sur `main`
2. Settings → Pages → Source : `main` / `/ (root)`
3. URL publique : `https://charlusminus.github.io/balinaisa-pz/`

## Intégration sur balinaisa.com

Coller avant `</body>` :

```html
<script src="https://charlusminus.github.io/balinaisa-pz/embed.js" defer></script>
```

Options : `data-position="bottom-right"` (défaut) / `"bottom-left"`, `data-label="…"`.

## Fonctionnement

Le front capture (photo + coordonnées + profil particulier/pro) et POST le lead au
webhook Activepieces. Toute la suite (agent déco IA, sélection produits + devis,
génération d'image, Google Sheets, emails) vit dans le flow Activepieces → voir
[`balinaisa-assets`](https://github.com/charlusminus/balinaisa-assets).
