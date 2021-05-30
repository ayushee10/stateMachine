var express = require('express');
var router = express.Router();
const logger = require('../utils/logger');
const { validate } = require('../utils/validationMiddleware');
const { initiateSchema, updateSchema } = require('../controller/requestSchema');
var docSMFactory = require('../controller/stateMachineController');

/**
* @api {POST} /initiate
* @apiParam  {String} required [docName]
* @apiParam  {String} required [triggerEvent] 
*/

router.post('/initiate', 

    initiateSchema(),
    validate,
    async function (req, res) {

      try {
         var response = await docSMFactory.initiate(req.body);
         logger.info("Print success response :: "+ response)
         res.status(201).json({message: response})
         } catch(error) {
         logger.error("Print Error :: "+ error.message)
         res.status(404).json(error.message)
      }
 });

 /**
* @api {GET} 
* @apiParam  {String} required [docName] 
*/
router.get('/:docName', 

   async function(req,res){
   
      try {
         console.log(req.params)
         var response = await docSMFactory.getDoc(req.params.docName);
         logger.info("Print success response :: "+ response)
         res.status(200).json({message: response})
         } catch(error) {
         logger.error("Print Error :: "+ error.message)
         res.status(404).json({message: error.message})
      }
});

/***
 *  @api {PUT} 
 *  
 * @apiParam  {String} required [docName]
 * @apiParam  {String} required [currentState]
 * @apiParam  {String} required [sourceState]
 * @apiParam  {String} required [event]
 * 
 */
 router.put('/updateDocState', 

   updateSchema(),
   validate,
 
   async function(req, res){
   try {
       var response = await docSMFactory.resetState(req.body);
       logger.info("Print success response :: "+ response)
       res.status(201).json({message: response})
   } catch (error) {
       res.status(404).json(error.message)
 }
});

 module.exports = router;
