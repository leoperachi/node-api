const express = require('express');
const bodyParser = require('body-parser');
const authRouter = require('./routes/auth');
var config = require('./config');
const app = express();

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json());

app.use('/', authRouter);

app.listen(config.port, () => {
    console.log(`Example app listening on port 4000`)
});