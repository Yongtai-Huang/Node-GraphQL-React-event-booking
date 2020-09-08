const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const graphQlSchema = require('./graphql/schema/index');
const graphQlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const isProduction = process.env.NODE_ENV === 'production';

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

if (isProduction) {
  //mongoose.connect(process.env.MONGODB_URI);
  mongoose.connect('mongodb://localhost/event', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  });
  mongoose.set('debug', !isProduction);
} else {
  mongoose.connect('mongodb://localhost/event', {
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  });
  mongoose.set('debug', true);
}

app.use(isAuth);

app.use(
  '/graphql',
  graphqlHTTP({
    schema: graphQlSchema,
    rootValue: graphQlResolvers,
    graphiql: true
  })
);

// start the server...
const server = app.listen( process.env.PORT || 3000, function(){
  console.log('Listening on port ' + server.address().port);
});