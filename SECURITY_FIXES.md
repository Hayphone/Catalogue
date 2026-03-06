# Catalogue WWS - Plan de correction securite & qualite

Review adversariale du 2026-03-06

## P1 - CRITIQUE

| # | Faille | Status | Details |
|---|--------|--------|---------|
| 1 | Token Telegram expose en clair (proxy backend) | DONE | Token supprime du HTML, Cloudflare Worker proxy cree dans telegram-proxy/ |
| 2 | XSS via innerHTML (escapeHtml) | DONE | Fonction escapeHtml() ajoutee, appliquee a tous les innerHTML dynamiques |

## P2 - ELEVE

| # | Faille | Status | Details |
|---|--------|--------|---------|
| 3 | productIndex fragile dans le panier | DONE | productId stable (name+category) ajoute, loadCart() re-resout les index |
| 4 | Comparaison TVA flottante === 0.055 | DONE | Comparaison sur chaine tva (includes 5,5/5.5) au lieu de float |
| 5 | Donnees client en clair localStorage | DONE | customerInfo migre vers sessionStorage (expire a la fermeture) |

## P3 - MOYEN

| # | Faille | Status | Details |
|---|--------|--------|---------|
| 6 | Pas de SRI sur scripts CDN | DONE | integrity sha384 + crossorigin anonymous ajoutes sur jsPDF et autotable |
| 7 | Code panier duplique 4x | DONE | setCartItem() + refreshProductUI() centralisent toute la logique |
| 8 | Pas de validation formulaire client | DONE | Validation telephone (8+ chiffres), email (regex), longueur max (100) |
| 9 | Fallback images silencieux | DONE | onerror remplace image par placeholder emoji au lieu de display:none |

## P4 - FAIBLE

| # | Faille | Status | Details |
|---|--------|--------|---------|
| 10 | z-index noise texture 10000 | DONE | Reduit a z-index: 1 |
| 11 | user-scalable=no (accessibilite) | DONE | Supprime maximum-scale et user-scalable=no |
| 12 | Lazy loading images grille | DONE | Deja present sur grid et table (verifie, rien a ajouter) |

## Deploiement Telegram Proxy

Le proxy Cloudflare Worker doit etre deploye separement.
Voir telegram-proxy/README.md pour les instructions.
L'URL du proxy doit etre mise a jour dans index.html (TG_PROXY constant).
