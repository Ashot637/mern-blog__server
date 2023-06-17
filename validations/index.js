const { body } = require('express-validator');

const registerValidation = [
  body('fullName', 'Minimum 3 characters').isLength({ min: 3 }),
  body('email', 'Invalid email').isEmail(),
  body('password', 'Minimum 5 characters').isLength({ min: 5 }),
  body('avatarUrl', 'Invalid Avatar Url').optional(),
];

const loginValidation = [
  body('email', 'Invalid email').isEmail(),
  body('password', 'Minimum 5 characters').isLength({ min: 5 }),
];

const postCreateValidation = [
  body('title', 'Minimum 3 characters').isLength({ min: 3 }),
  body('text', 'Minimum 3 characters').isLength({ min: 3 }),
  body('postImageUrl', 'Invalid Image Url').optional(),
];

module.exports = { registerValidation, loginValidation, postCreateValidation };
