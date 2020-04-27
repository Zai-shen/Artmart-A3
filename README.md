# Assignment 3: Backend with Node.js

In this third assignment, you are tasked with implementing a backend API server for Artmart:

- You will be using the [Express](https://expressjs.com) framework for [Node.js](https://nodejs.org).

- You need to fully implement the API specified in the [Artmart API Documentation][api_docs].

- Once again, there will be automated tests. **The tests are part of the specification.**

For the **Artworks** endpoint:

- You should implement an API gateway to the [Metropolitan Museum of Art Collection API][met_api]. In particular, `artworkId` should be identical with the Met API's `objectId`. The `image` should be `primaryImageSmall`.

- Your Met API gateway should cache responses from the Met API, so that subsequent requests to your server do not cause redundant Met API queries. This applies to the *Object* as well as the *Search* endpoints of the Met API.

- It is sufficient for the Met API cache to be entirely in-memory. Be careful to only cache necessary information.

- It is *not* necessary to implement any kind of cache eviction or garbage collection strategy for the Met API cache.

- The "selected highlights" mentioned in the API spec can be found in `highlights.json` in the `resources` folder.

For the **Shopping Cart**:

- You should use an appropriate in-memory data structure to associate session IDs with shopping carts. Do not use any kind of database or persistent offline storage. You can use the [nanoid][nanoid] library to create unique session IDs.

- Again, it is *not* necessary to implement any kind of cache eviction or garbage collection strategy for the shopping cart sessions.

- Note that when you are adding an item to the shopping cart, the client does *not* include the price. You should calculate the price server-side. The template code contains a function to help you with that.

For the **Checkout** process:

- You need to interface with the [Bling payment service][bling]. Read the Bling documentation carefully. You need to implement the server side of the payment flow. For testing purposes, you can play the part of the client using [curl](https://curl.haxx.se) or [HTTPie](https://httpie.org) or some GUI tool like [Insomnia](https://insomnia.rest).

- To implement the checkout process, you will need to keep track of orders and payment intents. Use appropriate in-memory data structures. No databases and no persistent storage.

- Your Bling API key is `ak_wes20a3_000` with `000` replaced by your three-digit 0-padded group number. For example, if your group number is 3, you API key is `ak_wes20a3_003`. If your group number is 128, your API key is `ak_wes20a3_128`. (Yes, the supposedly secret API key is easily guessable. This is just an exercise. Please don't do anything stupid.)

- The Bling API key should be provided to your server via an environment variable named `BLING_API_KEY`. Do not hardcode it.

- To debug the webhook, we recommend that you use [ngrok](https://ngrok.com) to temporarily expose your local server to the public internet over a secure tunnel. Note that this is only necessary if you want to understand the webhook workflow better, the test scripts do not depend on the real Bling service and you do not need ngrok to run the tests.

- In real life, you would secure the payment webhook. Preferably, it would only be accessible by whitelisted IP addresses of the payment provider. At the very least, there would be some kind of cryptographic signature check. For this assignment, it is sufficient to ensure that any event you receive on the webhook corresponds to a valid order within your system.

- In order to correctly set the `webhook` parameter when creating a payment intent with Bling, you need to know your server's base URL. Running locally, this will be something like `http://localhost:3000`. If you're tunneling via ngrok, you have a public URL like `https://xyz.ngrok.io`.  In either case, you should pass along the server's base URL via an environment variable named `ARTMART_BASE_URL`. Do not hardcode it.

- When a payment succeeds and your server receives a notification from Bling, you should create a receipt for the successful order. The receipts should be put in the `orders` folder and should follow the example laid out in `order-0000.json`. Receipts should be sequentially numbered. The template code contains a function to help you with that.

- Note that if an order was successful, the shopping cart should be empty again.

For **Frames, Mats, and Shipping Destinations**:

- The available frames, mat colors and shipping destinations can be found in the `resources` folder.

## What you need to do

- Check out the `server` folder. It contains a template on which you should build your solution. As always, take a look at what's there and figure out what remains to be done.

- **Read the assignment again, carefully.**

- Read the [Bling documentation][bling].

- Note that the project structure is slightly different than previously. In particular, the tests are now run from the top-level directory. See below.

- If something is not covered by the tests, *but specified in the assignment*, then we expect you to implement it. We might run additional tests on our end. Inversely, if something is not specified in the assignment, *but expected by the tests*, then we also expect you to implement it.

- Do not modify anything in the `test` folder. For the final assessment, we will entirely replace the test folder with our own (which also might include additional tests). If your code only works with modifications of the test scripts (no matter how trivial!) it will not pass the final tests.

- Do not modify `package.json` or install any additional packages. You are not allowed to use any third-party libraries, beyond the ones we have provided. (This also means you can't use TypeScript. Sorry.)

- **Keep it simple.** Try the simplest solution that could possibly work. Don't do anything fancy.

- As this is a group exercise, we expect all team members to contribute in roughly equal amounts. The git history reflects each team member's individual contributions, so keep that in mind.

- Please, for the love of god, **do not use real credit card numbers**.

## How to start the server / run the tests

You need to have [Node.js](https://nodejs.org) installed. We recommend the latest version (>= 13.12).

1. Make sure you are in the top-level directory of this project (viz. the directory this README file is in).

2. If this is the first time, install the required dependencies with `npm install`.

3. Now you can start the server with `npm start` or run the tests with `npm test`. As always, the tests will print out your point total and generate a `report.html` file.

[api_docs]: ./api.md
[met_api]: https://metmuseum.github.io
[bling]: https://web-engineering.big.tuwien.ac.at/s20/bling
[nanoid]: https://www.npmjs.com/package/nanoid
