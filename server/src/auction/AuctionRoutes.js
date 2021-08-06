const { Router } = require("express");

module.exports = (auctionDB, secret) => {
  const express = require("express");
  const router = express.Router();
  const bodyParser = require('body-parser');
  const bcrypt = require('bcryptjs');
  const jwt = require('jsonwebtoken');

  /**** Routes ****/
  //route for getting all the auctions
  router.get('/', async (req, res) => {
    const posts = await auctionDB.getAuctions(); 
    res.json(posts);
  });

  //route for getting a single auction based on its ID
  router.get('/:id', async (req, res) => {
    const post = await auctionDB.getAuction(req.params.id);
    res.json(post);
  });

  //route for creating a bid on an auction in the database
  router.post('/post/bid', async (req, res) =>{
    const post = await auctionDB.createBid(req.body.id, req.body.amount, req.body.bidder)
      .then(data => {
        res.json(post)
      })
      .catch(err =>{
        res.send("error posting to db")
      });
  });

  //route for creating an auction
  router.post('/post/create', async (req, res) => {
    const post = await auctionDB.createAuction(req.body.title, req.body.description, req.body.seller, req.body.deadline)
      .then(data => {
        console.log("posted perfectly fine")
        res.json(post)
      })
      .catch(err => {
        console.log("something didnt work out " + err)
        res.send("error posting to db")
      });
  });

  //route for authenticating the users and logging in
  router.post('/users/authenticate', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
      let msg = "Username or password missing!";
      console.error(msg);
      res.status(401).json({ msg: msg });
      return;
    }

    console.log(username + " " + password);

    auctionDB.getUser(username)
    .then(user => {
      if(!user){
        return res.status(404).json({ msg: "User not found!" });
      }
      console.log(password + " " + user.password);
      bcrypt.compare(password, user.password)
        .then(isMatch => {
          if(!isMatch) return res.status(400).json({msg:"invalid login credentials"});
          const payload = { username: username };
          const token = jwt.sign(payload, secret, { algorithm: 'HS512', expiresIn: '1h' });
  
          res.json({
            msg: `User '${username}' authenticated successfully`,
            token: token
          });

          
        })
    });
  });

  return router;
}