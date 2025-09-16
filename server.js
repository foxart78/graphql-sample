const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const { gql } = require("apollo-server-express");

// Dati di esempio
const users = [
  { id: "1", name: "Mario Rossi", email: "mario@email.com", age: 30 },
  { id: "2", name: "Giulia Bianchi", email: "giulia@email.com", age: 25 },
  { id: "3", name: "Luca Verdi", email: "luca@email.com", age: 35 },
];

const products = [
  { id: "1", name: "Laptop", price: 999.99, category: "Electronics" },
  { id: "2", name: "Smartphone", price: 599.99, category: "Electronics" },
  { id: "3", name: "Libro", price: 19.99, category: "Books" },
];

// Schema GraphQL
const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }

  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
    products: [Product!]!
    product(id: ID!): Product
    hello: String!
  }

  type Mutation {
    addUser(name: String!, email: String!, age: Int!): User!
    addProduct(name: String!, price: Float!, category: String!): Product!
  }
`;

// Resolver
const resolvers = {
  Query: {
    hello: () => "Ciao! Questo è il mio endpoint GraphQL!",
    users: () => users,
    user: (_, { id }) => users.find((user) => user.id === id),
    products: () => products,
    product: (_, { id }) => products.find((product) => product.id === id),
  },
  Mutation: {
    addUser: (_, { name, email, age }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
        age,
      };
      users.push(newUser);
      return newUser;
    },
    addProduct: (_, { name, price, category }) => {
      const newProduct = {
        id: String(products.length + 1),
        name,
        price,
        category,
      };
      products.push(newProduct);
      return newProduct;
    },
  },
};

async function startServer(options = {}) {
  const { port = process.env.PORT || 4000, listen = true } = options;
  const app = express();
  // Middleware di debug per loggare alcuni header di autenticazione (solo se DEBUG_LOG_AUTH_HEADERS=true)
  app.use((req, res, next) => {
    if (process.env.DEBUG_LOG_AUTH_HEADERS === 'true') {
      const interestingHeaders = [
        "authorization",
        "authentication",
        "x-api-key",
        "x-auth-token",
        "proxy-authorization",
      ];
      const collected = {};
      for (const h of interestingHeaders) {
        if (req.headers[h]) {
          const raw = Array.isArray(req.headers[h])
            ? req.headers[h].join(",")
            : req.headers[h];
            // Mascheriamo token lunghi per evitare esfiltrazione completa
          const masked =
            typeof raw === "string" && raw.length > 16
              ? raw.slice(0, 8) + "..." + raw.slice(-4)
              : raw;
          collected[h] = masked;
        }
      }
      if (Object.keys(collected).length > 0) {
        console.log("[DEBUG][AUTH_HEADERS]", collected);
      }
    }
    next();
  });

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Abilita l'introspection in produzione
    playground: true, // Abilita GraphQL Playground in produzione
  });

  await server.start();
  server.applyMiddleware({ app });

  return new Promise((resolve, reject) => {
    if (!listen) {
      return resolve({ app, apollo: server, httpServer: null, port: null });
    }
    const httpServer = app.listen(port, () => {
      const actualPort = httpServer.address().port;
      console.log(
        `🚀 Server pronto su http://localhost:${actualPort}${server.graphqlPath}`
      );
      resolve({ app, apollo: server, httpServer, port: actualPort });
    });
    httpServer.on('error', reject);
  });
}
// Avvio automatico solo se eseguito direttamente da CLI
if (require.main === module) {
  startServer().catch((error) => {
    console.error("Errore nell'avvio del server:", error);
  });
}

module.exports = { startServer, typeDefs, resolvers };
