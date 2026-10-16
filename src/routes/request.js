const express = require("express");
const requestRouter = express.Router();

const userAuth = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");
requestRouter.post("/request/send/:status/:toUserId", userAuth, async (req, res) => {
  
    try{
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if(!allowedStatus.includes(status)){
        return res.status(400).send({error: "Invalid status type"});
      }
      const touser = await User.findById(toUserId);
      if(!touser){
        return res.status(404).send({error: "User not found"});
      }
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or:[
          {fromUserId,toUserId},
          {fromUserId:toUserId,toUserId:fromUserId},
        ],
      });
      if(existingConnectionRequest){
        return res.status(400).send({error: "Connection request already exists"});
      }
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();
      res.json({
        messsage:
        req.user.firstName + " is " + status + " to connect with " + touser.firstName,
        data,
      });
    }

    catch(err){
      res.status(400).send({error: err.message});
    }
});

module.exports = requestRouter;