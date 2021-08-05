import { useState } from "react";

function Auction(props) {

    const {id, getAuction, addBid } = props;
    const auction = getAuction(id);

    const [bid, setBid] = useState("");

    function onSubmit() {
        
        
        if (bid <= auction.bids[auction.bids.length - 1].amount){
            console.log(bid + " " + auction.bids[auction.bids.length - 1]);
            alert("you need to bid higher then the current highest bid");
            return 0;
        }
      addBid(id, bid);
    }

    if (auction === undefined)
    {
      return <p>nothin' here boss id={id}</p>
    } 
    else
    {
        const timeLeft = (new Date(auction.deadline) - new Date())/1000/60/60;

        //render the auction page without the bidding button if the auction has passed the deadline
        if (timeLeft < 0)
            return (
                <>
                <h2>{auction.title}</h2>
                {auction.description}<br/>
                this auction has ended.
                    <h3>Bids:</h3> <br/>
                    {auction.bids.slice(0).reverse().map(bid => 
                    <li>
                        {bid.amount} <br/>
                        - made by by: {bid.bidder} at {bid.subDate}      
                    </li>)}           
            </>
            );
        //render the auction page with the bidding button
        return (
        <>
            <h2>{auction.title}</h2>
            {auction.description}<br/>
            this auction ends in roughly {timeLeft.toFixed(2)} hours.
                <h3>Bids:</h3> <br/>
                {auction.bids.slice(0).reverse().map(bid => 
                <li>
                    {bid.amount} <br/>
                    - made by by: {bid.bidder} at {bid.subDate}      
                </li>)}

            <h4>Place a new bid</h4> <br/>
            <input onChange={(event) => setBid(event.target.value)} type="number" name="bid" placeholder="type your bid here">
            </input> <br/>
  
            <button type="button" onClick={() => onSubmit()}>
                Place Bid
            </button>
        
        </>
        );
  }
}
  export default Auction;