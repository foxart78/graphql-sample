# Simple GraphQL Server

Un semplice server GraphQL basato su Express + Apollo Server.

## Requisiti

- Node >= 18 (per `fetch` nativo nei test)

## Script

- `npm start` avvia il server su `PORT` (default 4000)
- `npm run dev` avvia il server con nodemon
- `npm run test:gql` esegue test end-to-end (avvio server, query, mutation)

## Variabili d'ambiente

| Nome                   | Descrizione                                                                    | Default |
| ---------------------- | ------------------------------------------------------------------------------ | ------- |
| PORT                   | Porta di ascolto                                                               | 4000    |
| DEBUG_LOG_AUTH_HEADERS | Se `true` logga header auth mascherati su stdout                               | false   |
| AUTH_HEADERS_LOG_FILE  | Se valorizzato e DEBUG_LOG_AUTH_HEADERS=true, scrive log JSON newline nel file | (vuoto) |

Formato riga file log (JSON):

```
{"ts":"2025-09-16T12:34:56.789Z","path":"/graphql","headers":{"authorization":"Bearer abcd1234...wxyz"}}
```

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
8. (Solo debug) `AUTH_HEADERS_LOG_FILE=/var/log/auth-headers.log` (crea volume se necessario)
9. Deploy. Endpoint esposto: `https://<service>.onrender.com/graphql`

### 2. Railway.app

1. Importa repo da GitHub.
2. Railway crea ambiente Node automaticamente.
3. Imposta variabile `PORT` (Railway la fornisce comunque). Il codice usa `process.env.PORT`.
4. Comando Start: `node server.js`
5. (Opzionale) `DEBUG_LOG_AUTH_HEADERS` + `AUTH_HEADERS_LOG_FILE=/tmp/auth.log` (attenzione: storage effimero)
6. Dopo deploy: apri dominio -> aggiungi `/graphql`.

### 3. Fly.io

1. Installa CLI: `flyctl auth signup`.
2. Genera `fly.toml` (non incluso) con `flyctl launch`.
3. Dockerfile di base (vedi sotto) e volume se vuoi persistenza log.
4. `flyctl volumes create logs` (opzionale) e monta, poi `AUTH_HEADERS_LOG_FILE=/data/auth-headers.log`.
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
6. (Opzionale) `DEBUG_LOG_AUTH_HEADERS` e file log: usare path in `/tmp` (storage effimero) es. `/tmp/auth.log`.
7. Endpoint: `https://<app>-<region>.koyeb.app/graphql`.

### 5. Vercel

Vercel non esegue persistent server Express di default; serve un adattamento (Serverless) o passare a Apollo Server stand-alone / Edge. I file log su disco non sono persistenti; preferire stdout.

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

Per provare il logging file:

```
set DEBUG_LOG_AUTH_HEADERS=true
set AUTH_HEADERS_LOG_FILE=auth-headers.log
node server.js
```

## Endpoint playground

Una volta deployato visita `https://<host>/graphql` (Apollo Playground abilitato).

## Sicurezza (nota)

- `introspection` e `playground` abilitati anche in produzione: disabilitare in ambienti reali.
- Logging header auth disabilitato di default. Abilitalo solo per debug temporaneo e pulisci i log.
- Evita di committare file di log con potenziali token (anche se mascherati).

## Rotazione log semplice (manuale)

Esempio: rinomina e ricrea file (Windows PowerShell):

```
Rename-Item auth-headers.log auth-headers.old.log
New-Item auth-headers.log -ItemType File
```

Oppure (Linux):

```
mv auth-headers.log auth-headers.old.log && touch auth-headers.log
```

## Next Steps suggeriti

- Aggiungere linting (ESLint) e formattazione (Prettier).
- Aggiungere Jest per unit test di resolver.
- Estrazione dei dati fake in modulo separato e resettable.
- Rate limiting / CORS configurabili.
- Middleware di rate limiting / helmet per security.

## License

MIT (puoi aggiungere un file LICENSE se necessario).
