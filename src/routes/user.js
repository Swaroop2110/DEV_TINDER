const exprees = require('express');
const userRouter = express.Router();

const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/user/requests/received',userAuth, async(req,res)=>{
    try{
        const loggedInUserId = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUserId._id,
            status: "interested",
        }).populate('fromUserId','firstName lastName photoUrl age gender about skills');
        res.json({
            message:"data fetched successfully",
            data: connectionRequests,
        });
    }
    catch(err){
        res.status(400).send({error: err.message});
    }
})
module.exports = userRouter;