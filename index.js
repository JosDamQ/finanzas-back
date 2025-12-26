'use strict';

const mongoconfig = require('./config/mongo');
const app = require('./config/app');

mongoconfig.connect()
app.initSever();