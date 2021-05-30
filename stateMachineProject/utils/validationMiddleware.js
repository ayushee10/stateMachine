const { validationResult } = require('express-validator');

module.exports.validate = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    return res.status(400).json({message: 'Bad request', error: errors.errors});
  }
  
