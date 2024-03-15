const express = require('express');
const { ApolloSever } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const path = require('path');
const { authMiddleware } = require('./utils/auth');


const { typeDefs, resolvers } = require('./schemas');
const db = require('./config/connection');

const PORT = process.env.PORT || 3001;
const app = express();
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

//create a new instance of an apollo server with the graql schema 

const startApolloServer = async () => {
    await server.start();

    app.use(express.urlencoded({extended: false}));
    app.use(express.json());
    //setup static assets
    app.use('/images', express.static(path.join(__dirname, '../client/public/images')));

    app.use('/graphql', expressMiddleware(server, {
        context: authMiddleware
    }));

    if (process.env.NODE_ENV === 'production') {
        app.use(express.static(path.join(__dirname, '../client/dist')));

        app.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, '../client/dist/index.html'));
        });
    }

    db.once('open', () => {
        app.listen(PORT, () => {
            console.log(`API server runing on port $(PORT)!`);
            console.log((`Use GraphQL at http://localhost:${PORT}/graphql`));
        });
    });
};

startApolloServer();
