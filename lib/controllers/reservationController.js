var mrManager = require('../../ethereum/meetingRoomManager');
const web3 = require('../../ethereum/web3');

exports.reserve = async (req, res, next) => {
  try{
    var {roomId, timeSlotId, user} = req.body;
    var accounts = await web3.eth.getAccounts();
    var gasLimit = await mrManager.methods.reserveRoom(roomId, timeSlotId, user).estimateGas({ from:accounts[0] });
    var result = await mrManager.methods.reserveRoom(roomId, timeSlotId, user).send(
        { gas: gasLimit, gasPrice: web3.utils.toWei('2','gwei'), from: accounts[0] }
      );

    res.status(200).json({message:"room reserved"});
  }catch(error){
    next(error);
  }
}

exports.cancel = async (req, res, next) => {
  try{
    var {roomId, timeSlotId, user} = req.body;
    var accounts = await web3.eth.getAccounts();
    var gasLimit = await mrManager.methods.cancelReservation(roomId, timeSlotId, user).estimateGas({ from:accounts[0] });
    var result = await mrManager.methods.cancelReservation(roomId, timeSlotId, user).send(
        { gas: gasLimit, gasPrice: web3.utils.toWei('2','gwei'), from: accounts[0] }
      );

    res.status(200).json({message:"reservation canceled"});
  }catch(error){
    next(error);
  }
}
