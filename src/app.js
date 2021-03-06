require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
//const validateBearerToken = require('./validate-bearer-token');
const errorHandler = require('./error-handler');
const bookmarkRouter = require('../bookmarks/bookmarks-router');

//initialization
const app = express();

//middleware
const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());
//app.use(express.json());
//app.use(validateBearerToken);

app.use('/api', bookmarkRouter)

app.get('/', (req, res) => {
  res.status(200).send('Singhy');
});

app.use(errorHandler);
  
module.exports = app;

