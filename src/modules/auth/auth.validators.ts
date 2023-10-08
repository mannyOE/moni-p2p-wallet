import * as Joi from "joi"
import * as moment from "moment"

const addressValidator = (value, helpers) => {
  // Define an array of address-related terms to check for
  const addressTerms = ['avenue', 'street', 'road', 'close', /* Add more terms if needed */]

  // Check if the address contains at least one of the specified terms
  const isValid = addressTerms.some(term => value.toLowerCase().includes(term))

  if (!isValid) {
    return helpers.error('address.invalid')
  }

  return value
}

const dateValidator = (value, helpers) => {
  const today = moment()
  const dob = moment(value)

  // Calculate the age in years
  const age = today.diff(dob, 'years')

  // Check if the age is at least 18 years
  if (age < 18) {
    return helpers.error('dob.invalid')
  }

  return value
}


export const RegisterValidationSchema = Joi.object().keys({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  phone_number: Joi.string().regex(/^(\+?234|0)[789]\d{9}$/).message('Provide a valid phone number'),
  email: Joi.string().email().message('Provide a valid email address'),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-zA-Z]).+$/).message('Password must contain at least one letter and one number'),
  dob: Joi.date().custom(dateValidator, 'Date of Birth validation'),
  address: Joi.string().custom(addressValidator, 'Address validation')
})


export const LoginValidationSchema = Joi.object().keys({
  email: Joi.string().email().message('Provide a valid email address'),
  password: Joi.string().regex(/^(?=.*\d)(?=.*[a-zA-Z]).+$/).message('Password must contain at least one letter and one number')
})
