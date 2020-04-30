/**
 * This module contains the routes under /cart
 */

'use strict';

const express = require('express');
const routes = express.Router();
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const nanoid = require('nanoid');


class CartItem
{
  constructor(artworkId, printSize, frameStyle, frameWidth, matColor, matWidth) {
    this.artworkId  = artworkId;
    this.printSize  = printSize;
    this.frameStyle = frameStyle;
    this.frameWidth = frameWidth;
    this.matColor   = matColor;
    this.matWidth   = matWidth;
  }
}

class Cart
{
  constructor() {
    this.items = [];
  }

  static carts = new Map();
  static create(sessionId) { Cart.carts.set(sessionId, new Cart()); }
  static get(sessionId) { return Cart.carts.get(sessionId); }
  static delete(sessionId) { return Cart.carts.delete(sessionId); }

  clear() { this.items = []; }
}


// TODO: implement
// handles GET /cart
routes.get('/', (req, res) => {
  res.removeHeader('X-Powered-By');
  if (!req.cookies.sessionId) {
    // on first request, create new cart and send session cookie
    let sessionId = nanoid.nanoid();
    Cart.create(sessionId);
    res.cookie('sessionId', sessionId, { path: '/cart' });
    res.send({});
  } else {
    // if client reports valid session cookie, send content
    let result = Cart.get(req.cookies.sessionId);
    if (result) {
      // TODO: format response content
      res.send(result);
    } else {
      res.sendStatus(403);  // 403 Forbidden
    }
  }
});

// TODO: implement
// handles POST /cart
routes.post('/', (req, res) => {
  res.sendStatus(501);  // 501 Not Implemented
});

// handles DELETE /cart
routes.delete('/', (req, res) => {
  let cart = Cart.get(req.cookie.sessionId);
  if (cart) {
    cart.clear();
    res.sendStatus(204);  // 204 No Content
  } else {
    res.sendStatus(403);  // 403 Forbidden
  }
});

// TODO: implement
// handles GET /cart/{id}
routes.get('/', (req, res) => {
  res.sendStatus(501);  // 501 Not Implemented
});

// TODO: implement
// handles DELETE /cart/{id}
routes.delete('/', (req, res) => {
  res.sendStatus(501);  // 501 Not Implemented
});


module.exports = routes;
