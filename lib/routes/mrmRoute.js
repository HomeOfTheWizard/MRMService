var reservationController = require('../controllers/reservationController');
var roomCalendarController = require('../controllers/roomCalendarController');
const { celebrate, Joi, errors } = require('celebrate');
var express = require('express');

var router = express.Router();

router.route('/ReserveRoom').post(celebrate({
  body: Joi.object().keys({
    roomId: Joi.number().integer().required(),
    timeSlotId: Joi.number().integer().required(),
    user: Joi.string().required()
  })
}), reservationController.reserve)

router.route('/CancelReservation').post(celebrate({
  body: Joi.object().keys({
    roomId: Joi.string().required(),
    timeSlotId: Joi.number().integer().required(),
    user: Joi.string().required()
  })
}),reservationController.cancel)

router.route('/GetRoomCalendar').post(celebrate({
  body: Joi.object().keys({
    roomId: Joi.number().integer().required()
  })
}), roomCalendarController.getRoomAvailability)

router.route('/GetAvailableRooms').post(celebrate({
  body: Joi.object().keys({
    timeSlotId: Joi.number().integer().required()
  })
}),roomCalendarController.getAvailableRooms)

router.route('/GetReservations').post(celebrate({
  body: Joi.object().keys({
    user: Joi.string().required()
  })
}),roomCalendarController.getReservations)



module.exports = router;
