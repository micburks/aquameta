#!/usr/bin/env node
const express = require('express')
const path = require('path')
const app = express()
app.use((req, res, next) => {
  console.log(req.url)
  next()
})
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'))
})
app.use(express.static(path.join(__dirname, '../dist')))
app.listen(8080, function() {
  console.log('listening on port 8080')
})
