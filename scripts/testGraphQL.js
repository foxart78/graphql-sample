// Script di test semplice per l'endpoint GraphQL
// Avvia il server su porta random ed esegue query/mutation
// Uso: node scripts/testGraphQL.js

const { startServer } = require('../server');

let serverHandle = null;
let ENDPOINT = null;

async function bootstrapServer() {
  const started = await startServer({ port: 0, listen: true });
  serverHandle = started;
  ENDPOINT = `http://localhost:${started.port}/graphql`;
}

async function shutdownServer() {
  if (serverHandle && serverHandle.httpServer) {
    await new Promise(r => serverHandle.httpServer.close(r));
  }
}

async function gql(query, variables) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer exampleTokenPerDebug123456789' },
    body: JSON.stringify({ query, variables })
  });
  const json = await res.json();
  if (json.errors) {
    throw new Error('GraphQL Errors: ' + JSON.stringify(json.errors, null, 2));
  }
  return json.data;
}

async function run() {
  await bootstrapServer();
  console.log('Server avviato per i test sulla porta', serverHandle.port);

  const results = {};
  // 1. Query semplice
  results.hello = await gql('{ hello }');

  // 2. Lista utenti
  results.usersBefore = await gql('{ users { id name email age } }');

  // 3. Aggiungo un utente
  const name = 'Test User';
  const email = 'test.user@example.com';
  const age = 44;
  results.addUser = await gql('mutation($n:String!,$e:String!,$a:Int!){ addUser(name:$n,email:$e,age:$a){ id name email age }}', { n: name, e: email, a: age });

  // 4. Recupero utente appena inserito per id
  const newId = results.addUser.addUser.id;
  results.userById = await gql('query($id:ID!){ user(id:$id){ id name email age }}', { id: newId });

  // 5. Verifica incremento lista utenti
  results.usersAfter = await gql('{ users { id name } }');

  // 6. Aggiungo product e recupero
  results.addProduct = await gql('mutation($n:String!,$p:Float!,$c:String!){ addProduct(name:$n,price:$p,category:$c){ id name price category }}', { n: 'Prod Test', p: 12.34, c: 'TestCat' });
  const newProdId = results.addProduct.addProduct.id;
  results.productById = await gql('query($id:ID!){ product(id:$id){ id name price category }}', { id: newProdId });

  // Assert basilari
  const assertions = [];
  function assert(cond, msg) { if(!cond) assertions.push(msg); }

  assert(results.hello.hello && typeof results.hello.hello === 'string', 'hello query fallita');
  assert(results.addUser.addUser.email === email, 'email utente non corrisponde');
  assert(results.userById.user.id === newId, 'userById id mismatch');
  assert(results.usersAfter.users.length === results.usersBefore.users.length + 1, 'numero utenti non incrementato');
  assert(results.addProduct.addProduct.name === 'Prod Test', 'product name mismatch');
  assert(results.productById.product.id === newId, 'productById id mismatch');

  if (assertions.length) {
    console.error('TEST FALLITI:\n - ' + assertions.join('\n - '));
    process.exitCode = 1;
  } else {
    console.log('TUTTI I TEST PASSATI');
  }
}

// Node 18+ ha fetch globale, se mancante avvisa
if (typeof fetch !== 'function') {
  console.error('fetch non disponibile in questa versione di Node. Usa Node 18+');
  process.exit(1);
}

run()
  .catch(err => {
    console.error('Errore durante i test:', err);
    process.exitCode = 1;
  })
  .finally(() => shutdownServer());
