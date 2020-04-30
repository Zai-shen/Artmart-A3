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
    this.items = [];
  }

  static carts = new Map();
  static create(sessionId) { Cart.carts.set(sessionId, new Cart()); }
  static get(sessionId) { return Cart.carts.get(sessionId); }
  static delete(sessionId) { return Cart.carts.delete(sessionId); }

  clear() { this.items = []; }
  add(item) { this.items.push(item); }
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
    res.send([]);
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

// handles POST /cart
routes.post('/', (req, res) => {
  let sessionId = req.cookies.sessionId;
  let cart = Cart.get(sessionId);
  if (!cart) {
    res.sendStatus(403);  // 403 Forbidden
  } else {
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
      cart.add(item);
      res.sendStatus(201);  // 201 Created
    } else {
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
