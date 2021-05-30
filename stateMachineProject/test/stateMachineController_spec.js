var expect  = require('chai').expect;
var app = require('../app');
var request = require('supertest');
const { cleanDb, findOne } = require('../db/dbOps');

describe('stateMachineController', () =>{

    after(async() =>{
        await cleanDb();
    })

    describe('initate transition', () =>{

        it('should add new record in db with appropriate states', async() =>{
            
            const response = await 
            request(app)
            .post('/stateMachineDemo/initiate')
            .send({
                "docName": "testDoc1",
                "triggerEvent": "creationRequest"
            });
            expect(response.status).to.be.equal(201)

            const result = await findOne("testDoc1");
        
            expect(result).to.not.be.null;
            expect(result.currentState).to.be.equal('created');
            expect(result.sourceState).to.be.equal('init');
            expect(result.event).to.be.equal('creationRequest');
                       
        });

        it('should return Bad Request with status 404', async() =>{
            const response = await 
            request(app)
            .post('/stateMachineDemo/initiate')
            .send({
                "docName": "testDoc1",
                "triggerEvent": "validationRequestRejected"
            });

            expect(response.status).to.be.equal(404);
        })

        it('should update testDoc1 states in db', async() =>{
            const response = await 
            request(app)
            .post('/stateMachineDemo/initiate')
            .send({
                "docName": "testDoc1",
                "triggerEvent": "validationRequest"
            });
            expect(response.status).to.be.equal(201);

            const result = await findOne("testDoc1");

            expect(result.currentState).to.be.equal('validationPending');
            expect(result.sourceState).to.be.equal('created');
            expect(result.event).to.be.equal('validationRequest');
        })

    });

    describe('GET /:docName', () =>{

        it('should return document from db with states', async() =>{
            const response = await 
            request(app)
            .get('/stateMachineDemo/testDoc1');

            expect(response.status).to.be.equal(200);
            expect(response.body.message.docName).to.be.equal("testDoc1");
        });

        it('should return 404 when doc name doesnt exist in db', async() =>{
            const response = await 
            request(app)
            .get('/stateMachineDemo/testDoc2');

            expect(response.status).to.be.equal(404);
        });
    })
})