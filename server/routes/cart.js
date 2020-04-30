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
const price = require('../utils/price');


class CartItem
{
  constructor(artworkId, printSize, frameStyle, frameWidth, matColor, matWidth) {
    this.price      = price.calculatePrice(printSize, frameStyle, frameWidth, matWidth);
    this.artworkId  = artworkId;
    this.printSize  = printSize;
    this.frameStyle = frameStyle;
    this.frameWidth = frameWidth;
    this.matColor   = matColor;
    this.matWidth   = matWidth;
  }

  printSizeValid  = () => ['S', 'M', 'L'].includes(this.printSize);
  frameStyleValid = () => ['classic', 'natural', 'shabby', 'elegant'].includes(this.frameStyle);
  frameWidthValid = () => 20 <= this.frameWidth && this.frameWidth <= 50;
  matColorValid   = () => ['ivory', 'mint', 'wine', 'indigo', 'coal'].includes(this.matColor);
  matWidthValid   = () => 0 <= this.matWidth && this.matWidth <= 100;

  validate() {
    let report = {};
    if (!this.artworkId) report.artworkId = "missing";
    if (!this.printSize) report.printSize = "missing";
    else if (!this.printSizeValid()) report.printSize = "invalid";
    if (!this.frameStyle) report.frameStyle = "missing";
    else if (!this.frameStyleValid()) report.frameStyle = "invalid";
    if (!this.frameWidth) report.frameWidth = "missing";
    else if (!this.frameWidthValid()) report.frameWidth = "invalid";
    if (this.matWidth != 0) {
      if (!this.matColor) report.matColor = "missing";
      else if (!this.matColorValid()) report.matColor = "invalid";
    }
    if (!this.matWidth) report.matWidth = "missing";
    else if (!this.matWidthValid()) report.matWidth = "invalid";
    return report;
  }
}


class Cart
{
  constructor() {
    this.items = new Map();
    this.curId = 1;
  }

  static carts = new Map();
  static create(sessionId) { Cart.carts.set(sessionId, new Cart()); }
  static get(sessionId) { return Cart.carts.get(sessionId); }
  static delete(sessionId) { return Cart.carts.delete(sessionId); }

  add(item) { this.items.set(this.curId++, item); }
  item(cartItemId) { return this.items.get(cartItemId); }
  remove(cartItemId) { return this.items.delete(cartItemId); }
  clear() { this.items.clear(); this.curId = 1; }

  toJSON() {
    let result = [];
    this.items.forEach((val,key,map) => {
      let item = {
        cartItemId: key,
        ...val
      };
      result.push(item);
    });
    return result;
  }
}


// handles GET /cart
routes.get('/', (req, res) => {
  res.removeHeader('X-Powered-By');
  if (!req.cookies.sessionId) {
    // on first request, create new cart and send session cookie
    let sessionId = nanoid.nanoid();
    Cart.create(sessionId);
    res.cookie('sessionId', sessionId, { path: '/cart' });
    res.send([]);
  } else {
    // if client reports valid session cookie, send content
    let result = Cart.get(req.cookies.sessionId);
    if (result) {
      res.send(result);
    } else {
      res.sendStatus(403);  // 403 Forbidden
    }
  }
});

// handles POST /cart
routes.post('/', (req, res) => {
  // validate client's session cookie
  let sessionId = req.cookies.sessionId;
  let cart = Cart.get(sessionId);
  if (!cart) {
    res.sendStatus(403);  // 403 Forbidden
  } else {
    // parse received item data
    let item = new CartItem(
      req.body.artworkId,
      req.body.printSize,
      req.body.frameStyle,
      req.body.frameWidth,
      req.body.matColor,
      req.body.matWidth
    );
    let validityErrors = item.validate();
    if (JSON.stringify(validityErrors) === "{}") {
      // if data is valid, add item to cart
      cart.add(item);
      res.sendStatus(201);  // 201 Created
    } else {
      // otherwise send error report
      let response = {
        message: "Validation failed",
        errors: validityErrors
      };
      res.status(400).json(response);
    }
  }
});

// handles DELETE /cart
routes.delete('/', (req, res) => {
  let cart = Cart.get(req.cookies.sessionId);
  if (cart) {
    cart.clear();
    res.sendStatus(204);  // 204 No Content
  } else {
    res.sendStatus(403);  // 403 Forbidden
  }
});

// handles GET /cart/{id}
routes.get('/:id', (req, res) => {
  let cart = Cart.get(req.cookies.sessionId);
  if (cart) {
    let itemId = Number.parseInt(req.params.id);
    console.log(itemId);
    let item = cart.item(itemId);
    if (item) {
      let itemData = {
        cartItemId: itemId,
        ...item
      }
      res.json(itemData);
    } else {
      res.sendStatus(404);  // 404 Not Found
    }
  } else {
    res.sendStatus(403);  // 403 Forbidden
  }
});

// handles DELETE /cart/{id}
routes.delete('/:id', (req, res) => {
  let cart = Cart.get(req.cookies.sessionId);
  if (cart) {
    let itemId = Number.parseInt(req.params.id);
    console.log(itemId);
    let item = cart.item(itemId);
    if (item) {
      cart.remove(itemId);
      res.sendStatus(204);  // 204 No Content
    } else {
      res.sendStatus(404);  // 404 Not Found
    }
  } else {
    res.sendStatus(403);  // 403 Forbidden
  }
});


module.exports = routes;
