const { celebrate, Joi, errors } = require('celebrate');
const Extension = require('joi-date-extensions');
const JoiExt = Joi.extend(Extension);

const reservationRequestValidator = celebrate({
  body: Joi.object().keys({
    roomId: Joi.number().integer().required(),
    timeSlotId: Joi.number().integer().required(),
    user: Joi.string().required()
  })
})

module.exports.reservationRequestValidator = reservationRequestValidator;
module.exports.errors = errors;
