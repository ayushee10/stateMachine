const express = require ('express');
const mongoose = require('mongoose');
const config = require('config');
const logger = require('morgan');
const cors = require('cors');
const bodyParser = require('body-parser')
const routes = require('./routes/route');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(logger('dev'));
app.use('/stateMachineDemo', routes);

//swagger
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
var swaggerDocumentOptions = {
  explorer : true
};

app.use('/api-docs', swaggerUi.serve);
app.get('/api-docs', swaggerUi.setup(swaggerDocument, swaggerDocumentOptions));

const connectionString = `mongodb://${config.MONGO.USERNAME}:${config.MONGO.PASSWORD}@${config.MONGO.HOST}/${config.MONGO.DBNAME}?authSource=admin`;
//const connectionString = `mongodb://${config.MONGO.HOST}/${config.MONGO.DBNAME}`;
//const connectionString = `mongodb://root:example@localhost:27017`;
mongoose.connect(connectionString, {useNewUrlParser: true, useUnifiedTopology: true }, (err) =>{
  if(err) console.log("error with mongo connection ", err)
  else console.log("successfully connected with mongoDb")
});

app.get('/', (req, res) => {
    res.status(200)
        .json({ message: `Application is running on ${config.PORT} in ${config.NODE_ENV}` });
});

app.use((req, res, next) => {
    res.status(404)
        .json({ error: 'Endpoint not found' });
    next();
});

app.listen(config.PORT, function() {
  console.log("server starting on " + config.PORT);
});

module.exports = app; 