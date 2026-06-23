const express = require('express');
const path = require('path');
require('dotenv').config();

const routes = require('./src/routes');

const PORT = process.env.PORT || 8080;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const ROOT = __dirname;

const app = express();

app.use(express.json());

app.use('/public', express.static(path.join(ROOT, 'public')));
app.use(express.static(path.join(ROOT, 'src')));

app.use('/api', routes);

app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'src/index.html'));
});

app.listen(PORT, () => {
  console.log(`\nChá de Casa Nova — servidor local`);
  console.log(`  hotsite:  ${APP_URL}`);
});
