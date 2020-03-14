#!/usr/bin/env node

import express from 'express';
import path from 'path';
const app = express();

app.use((req, res, next) => {
  console.log(req.url);
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.resolve('index.html'));
});

app.use(express.static(path.resolve('../dist')));

app.listen(8080, function() {
  console.log('listening on port 8080');
});
