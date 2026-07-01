# Déploiement — Simulateur Balinaisa

## 1. Front (GitHub Pages)
`git push origin main` → mise en ligne automatique sur https://charlusminus.github.io/balinaisa-pz/

## 2. Google Sheets — écriture en 2 temps

Le flow écrit le lead **deux fois** pour ne jamais perdre la donnée si l'IA échoue :

1. **Phase 1** (`step_5`, `insert_row`) — à la soumission du form : capture immédiate du contact + `Statut = "Form reçu"`.
2. **Phase 2** (`step_8`, `update_row`) — après génération IA : met à jour **la même ligne** avec les produits recommandés, le devis et le lien de simulation, puis `Statut = "Simulation générée"`.
3. **Puis** les emails partent (`step_3` Balinaisa, `step_4` client).

### En-tête à mettre (ligne 1) — 13 colonnes A→M
```
Date | Heure | Profil | Entreprise | Prénom | Nom | Email | Téléphone | Horizon achat | Statut | Produits recommandés (IA) | Devis estimatif (IA) | Lien simulation
```
Les ~11 lignes existantes sont des tests : tu peux les vider (garde la ligne 1).

## 3. Activepieces (flow live)

Réimporte `Activepieces/Balinaisa — Simulateur Leads.json` sur cloud.activepieces.com puis republie.

Nouvelle chaîne :
```
trigger → step_1 (date) → step_2 (parse profil/contact)
        → step_5  insert_row   [PHASE 1 : contact, A–J]
        → step_7  (extrait le n° de ligne de l'insert)
        → step_6  IA (produits + devis + image)   ← placeholder pour l'instant
        → step_8  update_row   [PHASE 2 : reco IA, A–M, même ligne]
        → step_3  email Balinaisa
        → step_4  email client (image de simulation)
```

### ⚠️ À vérifier au 1er test live (spécifique à la piece Google Sheets)
- **`step_8.row_id`** est bindé sur `{{step_7['output']['row_number']}}`. `step_7` extrait le n° de ligne de la sortie d'`insert_row` (gère `row`, `rowId`, `rowNumber`, ou parse `updatedRange`). Si l'update vise la mauvaise ligne, regarde la sortie réelle de `step_5` dans le run et ajuste `step_7`.
- Si l'UI nomme le champ ligne autrement que `row_id` (selon version de la piece), re-mappe-le dans le builder.
- `step_8` ré-écrit **toutes** les colonnes A–M (contact + IA) pour éviter d'effacer le contact si l'`update_row` remplace la ligne entière.

### Résilience
- `step_5` (capture lead) : `continueOnFailure = false` (si on ne peut même pas sauver le lead, on veut le savoir).
- `step_6`, `step_7`, `step_8`, `step_3`, `step_4` : `continueOnFailure = true` → si l'IA ou l'update échoue, le lead reste sauvé en phase 1 et le run continue.

## 4. IA (à brancher plus tard)
`step_6` est un placeholder. Pour l'activer : POST Vertex AI Imagen 3 avec `photo_base64`, upload du résultat (Cloudinary/GCS/ImgBB), retour de l'URL publique dans `image_link` + remplir `products_label` et `devis_label`. Re-ajouter alors `photo_base64` au payload du front (`submitLead` dans `simulator.js`).
