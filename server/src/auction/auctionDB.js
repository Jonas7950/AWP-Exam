module.exports = (mongoose) => {

  const bcrypt = require('bcryptjs');

  //schema for the auctions and bids
  const auctionSchema = new mongoose.Schema({
    title: {type: String, required: true},
    description: {type: String, required: true},
    seller: {type: String, required: true},
    subDate: {type: Date},
    deadline: {type: Date},
    bids: 
      [{
        amount: {type: Number},
        bidder: {type: String}, 
        subDate: {type: Date}
      }]
  });
  //schema for the users
  const userSchema = new mongoose.Schema({
    username: String,
    password: String
  })
  userSchema.pre('save', async function(next){
    const hashedPassword = await new Promise((resolve, reject) => {
      bcrypt.hash(this.password, 10, function (err, hash) {
        if (err) reject(err); else resolve(hash);
      });
    });
    this.password = hashedPassword;
    console.log(`Hash generated for ${this.username}:`, this);
    next();
  });

  //models for the schemas
  const userModel = mongoose.model('user', userSchema);
  const auctionModel = mongoose.model('auction', auctionSchema);

  //getting all the auctions at the same time
  async function getAuctions() {
    try {
      return await auctionModel
        .find()
        .sort('-subDate')
    } catch (error) {
      console.error("getAuctions:", error.message);
      return {};
    }
  }

  //getting all the users at the same time
  async function getUsers() {
    try{
      return await userModel.find()
    } catch (error){
      console.error("getUsers:", error.message);
      return {};
    }
  }

  //getting a single auction based in the ID
  async function getAuction(id) {
    try {
      return await auctionModel.findById(id);
    } catch (error) {
      console.error("getAuction:", error.message);
      return {};
    }
  }

  //getting a single user based on the username
  async function getUser(Username) {
    try {
      console.log("getting user: " + Username)
      return await userModel.findOne({username : Username});
    } catch (error) {
      console.error("getUser:", error.message);
      return {};
    }
  }

  //creating an auction and storing it
  async function createAuction(Title, Description, Seller, hourDuration) {
    
    let auction = new auctionModel({
      title: Title, 
      description: Description, 
      seller: Seller, 
      subDate: new Date(), 
      deadline: new Date(+new Date() + 1000*60*60*hourDuration),
      bids:[]
    });
    return auction.save();
  }

  //find the correct auction to add the bid to, then add the bid
  async function createBid(id, Amount, Bidder){
    let parentAuction = await auctionModel.findById(id);
    let bid = {amount:Amount, bidder: Bidder, subDate: new Date()};
    parentAuction.bids.push(bid);

    return parentAuction.save();
  }

  //provide the API with dummy data if the database is empty
  //creates 4 accounts and 50 auctions with 3 bids on them each. all users are randomized
  async function bootstrap(count = 50) {

    let l = (await getAuctions()).length;
    console.log("Auction collection size: ", l);

    if (l === 0) {

      let promises = [];
      let tempUsers = [];

      for (let i = 0; i < 4; i++) {
        let newUser = new userModel({
          username: `user${i}name`,
          password: `pass${i}word`
        })
        promises.push(newUser.save());
        tempUsers.push(newUser);
      }

      for (let i = 0; i < count; i++) {

        let randomUser1 = tempUsers[Math.floor(Math.random()* tempUsers.length)];
        let randomUser2 = tempUsers[Math.floor(Math.random()* tempUsers.length)];
        let randomUser3 = tempUsers[Math.floor(Math.random()* tempUsers.length)];
        let randomUser4 = tempUsers[Math.floor(Math.random()* tempUsers.length)];

        let newAuction = new auctionModel({
          title: `Auction number ${i}`, 
          description:  `description for auction number ${i}`,
          seller: randomUser1.username,
          subDate: new Date(),
          deadline: new Date(+new Date() + 1000*60*60*48),
          bids: [
            {amount: (4+i), bidder: randomUser2.username, subDate: new Date()},
            {amount: (6+i), bidder: randomUser3.username, subDate: new Date()},
            {amount: (8+i), bidder: randomUser4.username, subDate: new Date()}
          ]});

        promises.push(newAuction.save());
      }

      return Promise.all(promises);
    }
  }

  return {
    getAuctions,
    getAuction,
    getUsers,
    getUser,
    createAuction,
    createBid,
    bootstrap
  }
}