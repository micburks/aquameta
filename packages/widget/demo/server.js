#!/usr/bin/env node
const { join } = require('path')
const express = require('express')
const veggie = require('veggie')
const app = express()

const middlewares = [
  (req, res, next) => {
    console.log(req.url)
    next()
  },
  express.static(join(__dirname, '../dist')),
  express.static(join(__dirname, '../demo')),
  veggie.router({ dir: 'demo/data/index.js' })
]
  
middlewares.forEach(fn => app.use(fn))

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'))
})


app.listen(8080, () => {
  console.log('listening on port 8080')
})
