// vendors
import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core';
import express from 'express';
import http from 'http';
import dotenv from 'dotenv';



// middlewares
import validateAuthentication from './middlewares/authentication.middleware.js';

// utilities
import connect from './database.js';

// typeDefs
import typeDefs from './schema/index.js';

// resolvers
import resolvers from './resolvers/index.js';

// Config

// Init variables de entorno
dotenv.config();
connect();

const startApolloServer = async (typeDefs, resolvers) => {
    const app = express();
    const httpServer = http.createServer(app);
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        introspection: true,
        playground: true,
        plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
        context: async ({ req }) => await validateAuthentication(req),
    });
    await server.start();
    //app.use(server.getMiddleware()); Método tradicional en una aplicación Express
    server.applyMiddleware({ app });
    await new Promise(resolve=>httpServer.listen({ port: process.env.PORT }, resolve));
    console.log(`Server started at http://localhost:${process.env.PORT}${server.graphqlPath}`);
};

startApolloServer(typeDefs, resolvers);