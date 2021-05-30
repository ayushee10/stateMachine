# stateMachine


This is a simple demonstration of State Machine architecture in nodeJs. The code is fairly crude and simple but can be extrapolated easily to other complex use cases. 
I have tried to create a state machine for a document that a user could upload. Once uploaded, it would go for a validation, it could be validated or rejected. 
The code doesn't focus on what business rules could lead to it being accepted or rejected. It deals with how with every event the state of doc changes. 
The document state transition would be as follows, 
init, 
created, 
validationPending, 
validated or rejected. 

The events responsible for state transitions are 'creationRequest', 'validationRequest', 'validationRequestAccepted', 'validationRequestRejected'. 

The documents will be stored in mongo db in the structure {
    "_id" : ObjectId("60b3b93c320a7a580d689b19"),
    "docName" : "doc1",
    "__v" : 0,
    "currentState" : "created",
    "event" : "creationRequest",
    "sourceState" : "init"
}
I have exposed 3 APIs, which could be found at http://localhost:3000/api-docs/#/

1. POST /initiate: will update documents states in db. The input fields are {
  "docName": "doc1",
  "triggerEvent": "creationRequest"
}
The trigger event could be any event from above, but if its a new document it should be creationRequest. Afterwards, for the same doc, the input could be 
  "docName": "doc1",
  "triggerEvent": "validationRequest", since the next logical step would be to create a validation request, if you try giving validationRequestAccepted it would fail
as the state machine doesn't allow for state to change from created to validated.

2. GET /:docName: it would fetch the docment based on docName from db
3. PUT /updateDocState: it would allow to change the state for doc. But you need to provide appropriate source and current states, for instance you cant update
doc to be in source state init and current state validationPending, since state machine won't allow such transition. 

To run the application, 
1. goto stateMachineProject folder and do npm install
2. goto local_network folder and run docker-compose up -d. It will create a container for mongo and node application. Once up, you can check the swagger to interact
with the application. 
3. to run the test cases goto stateMachineProject and run npm test. 










