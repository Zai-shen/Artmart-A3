/**
 * This module contains the routes under /artworks
 */

'use strict';

const express = require('express');
const routes = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');

routes.get('/', async (req, res) => {
  if (req.query.q == null) {
    res.send([]); // TODO: return highlights
  } else {
    // TODO: search for artworks
    res.sendStatus(501);
  }
});

routes.get('/:id', async (req, res) => {
  res.sendStatus(404);
});

module.exports = routes;
