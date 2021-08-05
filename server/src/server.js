/**** Node.js libraries *****/
const path = require('path');

/**** External libraries ****/
const express = require('express'); 
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const mongoose = require('mongoose');
const checkJwt = require("express-jwt");

/**** Configuration ****/
const app = express(); 
const MONGO_URL = process.env.MONGO_URL || 'mongodb://localhost/auctions'; 
const secret = process.env.SECRET || "the cake is a lie";

async function createServer() {
  // Connect db
  await mongoose.connect(MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true});

    // Create data
    const auctionDB = require('./auction/auctionDB')(mongoose);
    await auctionDB.bootstrap();

  const AuctionRoutes = require("./auction/AuctionRoutes")(auctionDB, secret);

  app.use(bodyParser.json()); 
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(morgan('combined')); 
  app.use(cors());
  app.use(express.static(path.resolve('..', 'client', 'build'))); 
  app.use(express.json());
  
  const openPaths = [
    { url: "/api/users/authenticate", methods: ["POST"] },
    { url: /\/api*/gim, methods: ["GET"] }
    ,{ url: /\/api*/gim, methods: ["POST"] }
  ];

  // Validate the user token using checkJwt middleware.
  app.use(checkJwt({ secret, algorithms: ["HS512"] }).unless({ path: openPaths }));

  // This middleware checks the result of checkJwt above
  app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") { // If the user didn't authorize correctly
    res.status(401).json({ error: err.message }); // Return 401 with error message.
  } else {
    next(); // If no errors, forward request to next middleware or route handler
  }
});


  /**** Add routes ****/
  app.use("/api", AuctionRoutes);

  // "Redirect" all non-API GET requests to React's entry point (index.html)
  app.get('*', (req, res) =>
    res.sendFile(path.resolve('..', 'client', 'build', 'index.html'))
  );
  
  return app;
}

module.exports = createServer;