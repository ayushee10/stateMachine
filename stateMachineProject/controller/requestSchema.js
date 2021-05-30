const { body } = require('express-validator/check')


const initiateSchema = () => {
    return [
        body('docName', 'is required')
        .exists()
        .trim()
        .isString(),
        body('triggerEvent', 'is required')
        .exists()
        .trim()
        .isString()
    ]
  };

const updateSchema = () => {
    return [
        body('docName', 'is required')
        .exists()
        .trim()
        .isString(),
        body('sourceState', 'is required')
        .exists()
        .trim()
        .isString(),
        body('currentState', 'is required')
        .exists()
        .trim()
        .isString(),
        body('event', 'is required')
        .exists()
        .trim()
        .isString(),
    ]
}

  module.exports = {
      initiateSchema,
      updateSchema
  }
