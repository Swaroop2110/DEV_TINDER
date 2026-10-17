const exprees = require('express');
const userRouter = express.Router();

const {userAuth} = require('../middlewares/auth');
const ConnectionRequest = require('../models/connectionRequest');
const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";
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


userRouter.get("/user/connections",userAuth, async(req,res)=>{
    try{
        const loggedInUserId = req.user;
        const connectionRequests= await ConnectionRequest.find({
            $or:[
                {toUserId: loggedInUseId._id,status:"accepted"},
                {fromUserId:loggedInUserId._id,status:"accepted"},   
            ],
        })
        .populate('fromUserId',USER_SAFE_DATA)
        .populate('toUserId',USER_SAFE_DATA);
        console.log(connectionRequests);
        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString() === loggedInUserId._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
        res.json({data});
    }
    catch(err){
        res.status(400).send({message: err.message});
    }
})
module.exports = userRouter;