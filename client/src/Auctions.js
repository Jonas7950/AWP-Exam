import {Link} from '@reach/router';

//figure out wether to render the highest current bid on the auction or to render the string "None", if there are no active bids
function HighestBid(auction){
    if (auction.length < 1)
        return "None";
    else
        return auction[(auction.length - 1)].amount;
}

function Auctions(props) {
  const {data} = props;
  return (
    <>
    <p>Auctions go here:</p>
      <ol>
        {
          data.map(auction => 
          <li>
            <h2>
                <Link to={`/${auction._id}`}>
                    {auction.title} - {auction.description}
                </Link>                  
            </h2>
            <ol>
                {auction.seller} - {auction.subDate} <br/>
                largest bid: {HighestBid(auction.bids)}
            </ol>
          </li>)}
      </ol>
      
    </>
  );
}
export default Auctions;