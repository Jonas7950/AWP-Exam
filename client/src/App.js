import {useEffect, useState} from "react";
import { Link, Router } from "@reach/router";
import jwtDecode from 'jwt-decode';

import Auctions from "./Auctions";
import Auction from "./Auction";
import Login from "./Login";
import AddAuction from "./AddAuction";
import AuthService from "./AuthService";

const API_URL = process.env.REACT_APP_API;

const authService = new AuthService(`${API_URL}/users/authenticate`)

function App() {

  const [auctions, setauctions] = useState([]);
  const [auctionCount, setAuctionCount] = useState(0);
  
  //fetch the data from the database
  useEffect(() => {
    async function getData() {
      const url = `${API_URL}/`;
      const response = await fetch(url);
      const auctions = await response.json();
      setauctions(auctions);
    }
    getData();
  }, [auctionCount]);  

    // Login using API
    async function login(username, password) {
      try {
        const resp = await authService.login(username, password);
        console.log("Authentication:", resp.msg);
        setAuctionCount(p => p + 1);
        alert("Succesfully logged in");
      } catch (e) {
        console.log("Login", e);
      }
    }

  //get an auction based in the ID
  function getAuction(id){
    return auctions.find(auction => auction._id === id);
  }

  //post the auction data to the API, but only if you're currently logged in with a valid account
  function addAuction(_title, _description, _deadline){
    if (authService.getToken() == null){
      alert("You're not logged in! Log in first");
      return 0;
    };
    const data = { 
      title: _title, 
      description: _description,
      seller: (jwtDecode(authService.getToken()).username),
      deadline: _deadline
    };
    const auctionData = async () => {
      const url = `${API_URL}/post/create`;
      const response = await authService.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((result) => {console.log(result)});
    }; 
    auctionData();
    setAuctionCount(p => p + 1);
  }

  //same as with posting an auction, it adds a bid to the selected auction, but only if there's a valid token
  function addBid(_id, _amount){
    if (authService.getToken() == null){
      alert("You're not logged in! Log in first");
      return 0;
    };
    const data = { 
      id: _id, 
      amount: _amount,
      bidder: (jwtDecode(authService.getToken()).username)
    };
    const auctionData = async () => {
      const url = `${API_URL}/post/bid`;
      const response = await authService.fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((result) => {console.log(result)});
    }; 
    auctionData();
    setAuctionCount(p => p + 1);
  }
  
  return (
    <>
      <Link to="/"><h1>Mern Auction Application</h1></Link> 
      <Link to="/login">Log in</Link> <br/>
      <Link to="/createAuction">Create an Auction</Link>

      <Router>
        <Auctions path="/" data={auctions}></Auctions>
        <Auction path="/:id" data={auctions} getAuction={getAuction} addBid={addBid}></Auction>
        <Login path="/login" login={login}></Login>
        <AddAuction path="/createAuction" addAuction={addAuction}></AddAuction>
      </Router>
    </>
  );
}

export default App;
