# Simple GraphQL Server

Un semplice server GraphQL basato su Express + Apollo Server.

## Requisiti
- Node >= 18 (per `fetch` nativo nei test)

## Script
- `npm start` avvia il server su `PORT` (default 4000)
- `npm run dev` avvia il server con nodemon
- `npm run test:gql` esegue test end-to-end (avvio server, query, mutation)

## Variabili d'ambiente
| Nome | Descrizione | Default |
|------|-------------|---------|
| PORT | Porta di ascolto | 4000 |
| DEBUG_LOG_AUTH_HEADERS | Se `true` logga header auth mascherati | false |

## Deploy gratuito (ambienti consigliati)
Di seguito istruzioni rapide per alcuni provider free / tier gratuiti.

### 1. Render.com
1. Effettua push del repo su GitHub.
2. Su Render: New + Web Service.
3. Seleziona il repo.
4. Build Command: `npm install`
5. Start Command: `node server.js`
6. Environment: Node 18+ (Render autodetect)
7. Aggiungi (opzionale) variabile: `DEBUG_LOG_AUTH_HEADERS=false`
8. Deploy. Endpoint esposto: `https://<service>.onrender.com/graphql`

### 2. Railway.app
1. Importa repo da GitHub.
2. Railway crea ambiente Node automaticamente.
3. Imposta variabile `PORT` (Railway la fornisce comunque). Il codice usa `process.env.PORT`.
4. Comando Start: `node server.js`
5. Dopo deploy: apri dominio -> aggiungi `/graphql`.

### 3. Fly.io
1. Installa CLI: `flyctl auth signup`.
2. Genera `fly.toml` (non incluso) con `flyctl launch` (scegli Node, non avvia subito il deploy se vuoi editare).
3. Imposta internal port 8080 se vuoi, oppure lascia 4000 e cambi `internal_port`.
4. Comando di esecuzione nel Dockerfile: `CMD ["node", "server.js"]`.
5. Deploy: `flyctl deploy`.

Esempio minimale `Dockerfile`:
```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
ENV PORT=4000
EXPOSE 4000
CMD ["node", "server.js"]
```

### 4. Koyeb
1. New Service -> GitHub repo.
2. Runtime: Node (build automatico).
3. Build Command: vuoto (usa `npm install`).
4. Run Command: `node server.js`.
5. Imposta `PORT` (Koyeb può fornirne una; il server ascolterà su quella).
6. Endpoint: `https://<app>-<region>.koyeb.app/graphql`.

### 5. Vercel
Vercel non esegue persistent server Express di default; serve un adattamento (Serverless) o passare a Apollo Server stand-alone / Edge.
Opzioni:
- Wrappare Express in una funzione serverless (`api/index.js`).
- Oppure usare `@apollo/server` in modalità standalone.

Esempio rapido `api/graphql.js` (da creare) per Vercel:
```
const { ApolloServer } = require('@apollo/server');
const { startServerAndCreateNextHandler } = require('@as-integrations/next');
// Riutilizza typeDefs e resolvers esportati
const { typeDefs, resolvers } = require('../server');

const server = new ApolloServer({ typeDefs, resolvers });
module.exports = startServerAndCreateNextHandler(server);
```
(Andrebbe poi riadattata la struttura del progetto.)

Per semplicità consigliato Render / Railway per ambienti di test.

## Test locale
```
npm install
npm run test:gql
```

## Endpoint playground
Una volta deployato visita `https://<host>/graphql` (Apollo Playground abilitato).

## Sicurezza (nota)
- `introspection` e `playground` abilitati anche in produzione: disabilitare in ambienti reali.
- Logging header auth disabilitato di default. Abilitalo solo per debug temporaneo.

## Next Steps suggeriti
- Aggiungere linting (ESLint) e formattazione (Prettier).
- Aggiungere Jest per unit test di resolver.
- Estrazione dei dati fake in modulo separato e resettable.
- Rate limiting / CORS configurabili.

## License
MIT (puoi aggiungere un file LICENSE se necessario).
