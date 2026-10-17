const moongose = require('moongose');
const connectionRequestSchema = new moongose.Schema({
    fromUserId:{
        type: moongose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    toUserId:{
        type: moongose.Schema.Types.ObjectId,
        required: true,
    },
    status:{
        type: String,
        required: true,

        enum:{
         values:   ["ignored","interested","accepted","rejected"],
         message:`{VALUE} is incorrect status type`,
        },
    },
},
{timestamps:true}
);
connectionrequestSchema.index({fromUserId:1,toUserId:1});
connnectionRequestSchema.pre('save',function(next){
    const connectionRequest = this;
    if(connectionReques.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error('fromUserId and toUserId cannot be the same');
    }
    next();
});
const ConnectionRequestModel = moongose.model('ConnectionRequest',connectionRequestSchema);
module.exports = ConnectionRequestModel;