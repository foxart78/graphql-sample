const { ApolloServer } = require('apollo-server-express');
const express = require('express');
const { gql } = require('apollo-server-express');

// Dati di esempio
const users = [
  { id: '1', name: 'Mario Rossi', email: 'mario@email.com', age: 30 },
  { id: '2', name: 'Giulia Bianchi', email: 'giulia@email.com', age: 25 },
  { id: '3', name: 'Luca Verdi', email: 'luca@email.com', age: 35 }
];

const products = [
  { id: '1', name: 'Laptop', price: 999.99, category: 'Electronics' },
  { id: '2', name: 'Smartphone', price: 599.99, category: 'Electronics' },
  { id: '3', name: 'Libro', price: 19.99, category: 'Books' }
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
    hello: () => 'Ciao! Questo è il mio endpoint GraphQL!',
    users: () => users,
    user: (_, { id }) => users.find(user => user.id === id),
    products: () => products,
    product: (_, { id }) => products.find(product => product.id === id)
  },
  Mutation: {
    addUser: (_, { name, email, age }) => {
      const newUser = {
        id: String(users.length + 1),
        name,
        email,
        age
      };
      users.push(newUser);
      return newUser;
    },
    addProduct: (_, { name, price, category }) => {
      const newProduct = {
        id: String(products.length + 1),
        name,
        price,
        category
      };
      products.push(newProduct);
      return newProduct;
    }
  }
};

async function startServer() {
  const app = express();
  
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: true, // Abilita l'introspection in produzione
    playground: true     // Abilita GraphQL Playground in produzione
  });

  await server.start();
  server.applyMiddleware({ app });

  const PORT = process.env.PORT || 4000;
  
  app.listen(PORT, () => {
    console.log(`🚀 Server pronto su http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer().catch(error => {
  console.error('Errore nell\'avvio del server:', error);
});