const logger = require('../utils/logger');
const StateMachine = require('javascript-state-machine');
const { updateEntity, findOne } = require('../db/dbOps');

var docStateMachine = new StateMachine({
    init: 'init',
    transitions: [
        {name: 'creationRequest', from: 'init', to: 'created'},
        {name: 'validationRequest', from: 'created', to:'validationPending'},
        {name: 'validationRequestAccepted', from: 'validationPending', to:'validated'},
        {name: 'validationRequestRejected', from: 'validationPending', to:'rejected'},
        { name: 'goto', from: '*', to: function(s) { return s }}
    ]
});

docStateMachine.observe({
    onCreationRequest: async(lifecycle, docName)=>{
        let entity ={};
        const doc = await findOne(docName);
        if(!doc) {
            entity.sourceState = lifecycle.from;
            entity.currentState = lifecycle.to;
            entity.event = lifecycle.transition;
            entity.docName = docName;
            await updateEntity(entity)
            return true;
        }
    },

    onValidationRequest: async function(lifecycle, docName) { 
        const response = await transition(docName, lifecycle.to, lifecycle.from, lifecycle.transition);
        return response;
    },

    onValidationRequestAccepted: async function(lifecycle, docName) { 
        const response = await transition(docName, lifecycle.to, lifecycle.from, lifecycle.transition);
        return response;
    },

    onValidationRequestRejected: async function(lifecycle, docName) { 
        const response = await transition(docName, lifecycle.to, lifecycle.from, lifecycle.transition);
        return response;
    },
});


async function transition(docName, to, from, transitionEvent ){
    const existingDoc = await findOne(docName);
    if(existingDoc){
        existingDoc.sourceState = from;
        existingDoc.currentState = to;
        existingDoc.event = transitionEvent;
    }
    await updateEntity(existingDoc)
    return true;
}

/***
 *  @method initiate: Initiate and update state transitions
 *  @param docName [string] 
 *  @param triggerEvent [string]
 */

exports.initiate = async(req) =>{
    const { docName, triggerEvent } = req;

    let allPossibleTransitions = [];
    let matchTransition = false; 
    let currentEntity = {}
    // check if the incoming doc has already been onboarded onto the db
    const res = await findOne(docName);
    if(res){
        currentEntity.sourceState = res.sourceState;
        currentEntity.currentState = res.currentState;
        currentEntity.event = res.event;
        currentEntity.docName = res.docName;
    
        docStateMachine.goto(currentEntity.currentState)
        allPossibleTransitions = docStateMachine.transitions();
    
        if (allPossibleTransitions.length > 0) {
            // Check if Event requested is valid for CurrentState, throw error if not else proceed with the event invocation
            allPossibleTransitions.forEach(element => { 
                if (element === triggerEvent) {
                    matchTransition = true;
                }
              });

              if (matchTransition === false) {
                  throw new Error("Event: "+triggerEvent+" is not valid for State: "+docStateMachine.state);
              }
        }

    } else {
        docStateMachine.goto("init");
        logger.info("No data found:: "+ docStateMachine.state)  
    }

     logger.info("Invoke Transitions :")

    switch (triggerEvent) {
        case 'creationRequest': 
                        logger.info("Inside creationRequest :: ")
                        resp = await docStateMachine.creationRequest(docName);
                        if (resp === true) {
                            return "Transition details updated successfully!"
                        } else {
                            throw new Error("Invalid state transition for event "+triggerEvent + "for doc :"+docName)
                        }
                        break;
        case 'validationRequest': 
                        logger.info("Inside validationRequest :: ")
                        resp = await docStateMachine.validationRequest(docName);
                        if (resp === true) {
                            return "Transition details updated successfully!"
                        } else {
                            throw new Error("Invalid state transition for event "+triggerEvent + "for doc :"+docName)
                        }
                        break;
        case 'validationRequestAccepted':
                        logger.info("Inside validationRequestAccepted :: ")
                        resp = await docStateMachine.validationRequestAccepted(docName);
                        if (resp === true) {
                            return "Transition details updated successfully!"
                        } else {
                            throw new Error("Invalid state transition for event "+triggerEvent + "for doc :"+docName)
                        }
                        break;
        case 'validationRequestRejected': 
                        logger.info("Inside validationRequestRejected :: ")
                        resp = await docStateMachine.validationRequestRejected(docName);
                        if (resp === true) {
                            return "Transition details updated successfully!"
                        } else {
                            throw new Error("Invalid state transition for event "+triggerEvent + "for doc :"+docName)
                        }
                        break;
        default:
            logger.info("No Match Found .... Please check the Transition and Try Again!")
            throw new Error("No Match Found .... Please check the Transition and Try Again!")

    }

};

/***
 * @method getDoc 
 * @param [string] docName 
 * @abstract retuns state transitions for a docName
 * 
 */
 exports.getDoc = async (docName) => {
        
    const res = await findOne(docName)
    if (res){
        return res
    } else {
        throw new Error(`No matching document found for ${docName}`)
    }
}

/***
 * @method resetState 
 * @param [string] docName
 * @param [string] sourceSate
 * @param [string] currentSate
 * @param [string] event
 * 
 */
 exports.resetState = async (req) => {
    let existingDoc = await findOne(req.docName);
    let matchTransition = false;
    if(!existingDoc){
        throw new Error(req.docName, " is not present in DB");
    } else {
        docStateMachine.goto(req.sourceState)
        allPossibleTransitions = docStateMachine.transitions();

        if (allPossibleTransitions.length > 0) {
            // Check if Event requested is valid for CurrentState, throw error if not else proceed with the event invocation
            allPossibleTransitions.forEach(element => { 
                if (element === req.event) {
                    matchTransition = true;
                }
              });

              if (matchTransition === false) {
                  throw new Error("Event: "+req.event+" is not valid for State: "+docStateMachine.state)
              }
        }
        if(matchTransition === true){
            existingDoc.sourceState = req.sourceState;
            existingDoc.currentState = req.currentState
            existingDoc.event = req.event;
            existingDoc.docName = req.docName;
            await updateEntity(existingDoc);
            return "State Reset is successful"  
        } else {
            throw new Error("Event: "+req.event+" is not valid for State: "+docStateMachine.state);
        }
        
    }
 }



