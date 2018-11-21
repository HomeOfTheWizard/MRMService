var mrManager = require('../../ethereum/meetingRoomManager');
const web3 = require('../../ethereum/web3');


exports.getRoomAvailability = async (req, res, next) => {
  try{
    var {roomId} = req.body;

    var result = await mrManager.methods.getRoomAvailability(roomId).call();

    res.status(200).json(result);
  }catch(error){
    next(error);
  }
}

exports.getAvailableRooms = async (req, res, next) => {
  try{
    var {timeSlotId} = req.body;

    const roomNb = await mrManager.methods.roomNb().call();

    const roomCalendars = await Promise.all( Array(parseInt(roomNb)).fill().map( (element,index) => {
        return mrManager.methods.getRoomAvailability(parseInt(index)+1).call();
      })
    );

    var availableRooms = roomCalendars.filter( (roomCalendar) => {
      return (!roomCalendar.reservedTimeSlots.includes(timeSlotId.toString()));
    }).map(roomCalendar => roomCalendar.roomID);

    res.status(200).json({availableRooms});
  }catch(error){
    next(error);
  }
}


exports.getReservations = async (req, res, next) => {
  try{
    var { user } = req.body;

    const roomNb = await mrManager.methods.roomNb().call();

    const roomReservationsArray = await Promise.all( Array(parseInt(roomNb)).fill().map( (element,index) => {
        return mrManager.methods.getReservations(parseInt(index)+1, user).call();
      })
    );

    clearRoomReservations = roomReservationsArray.map( roomReservations =>
      {
        return ({
          roomID:roomReservations.roomID,
          reservations:roomReservations.reservations.filter( (item) => {return item!='0'} )
        })
      }
    ).filter( (roomReservations) => {
      return (roomReservations.reservations.length!=0);
    });

    res.status(200).json(clearRoomReservations);
  }catch(error){
    next(error);
  }
}
