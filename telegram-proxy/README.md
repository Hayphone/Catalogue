# WWS Telegram Proxy (Cloudflare Worker)

Proxy securise pour l'envoi de commandes via Telegram.
Le token bot n'est jamais expose cote client.

## Deploiement

1. Installer Wrangler: `npm install -g wrangler`
2. Se connecter: `wrangler login`
3. Deployer: `cd telegram-proxy && wrangler deploy`
4. Configurer les secrets:
   ```
   wrangler secret put TG_BOT_TOKEN
   # Coller: 7949208348:AAEu4bfRiKnclBfCs1_ULqvCU0YP-HSWpaI
   wrangler secret put TG_CHAT_ID
   # Coller: 6497149266
   ```
5. Mettre a jour l'URL dans index.html:
   Remplacer `YOUR_CF_SUBDOMAIN` par votre sous-domaine Cloudflare Workers.

## Endpoints

- `POST /send-message` — Envoie un message texte
  Body: `{ "text": "...", "parse_mode": "HTML" }`
- `POST /send-document` — Envoie un PDF
  Body: FormData avec `document` (blob), `filename`, `caption`
