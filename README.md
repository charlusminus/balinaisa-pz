# Balinaisa — Simulateur d'intérieur IA

Prototype de simulateur de homestaging pour Balinaisa, propulsé par Paktiz.

## Structure

```
index.html     — page principale (wizard multi-étapes)
styles.css     — design system
simulator.js   — logique UI, catalogue, devis
embed.js       — snippet à coller sur balinaisa.com
```

## Déploiement GitHub Pages

1. Push sur `main`
2. Dans Settings → Pages → Source : `main` / `/ (root)`
3. URL publique : `https://charlusminus.github.io/balinaisa-pz/`

## Intégration sur balinaisa.com

Coller avant `</body>` :

```html
<script src="https://charlusminus.github.io/balinaisa-pz/embed.js" defer></script>
```

Options disponibles :
- `data-position="bottom-right"` (défaut) ou `"bottom-left"`
- `data-label="Mon texte de bouton"`

## TODO avant mise en production

- [ ] Remplacer `BALINAISA_WEBHOOK_ID` dans `simulator.js` par le vrai ID Activepieces
- [ ] Connecter l'appel Vertex AI (Imagen 3) dans le flow Activepieces
- [ ] Ajouter les vraies photos produit (PNG fond blanc ou transparent)
- [ ] Mettre à jour le catalogue dans `CATALOG` avec les URLs d'images réelles
- [ ] Tester le formulaire de contact (email + Google Sheets)
