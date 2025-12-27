'use strict';

const mongoconfig = require('./config/mongo');
const app = require('./config/app');
const cronService = require('./src/services/cron.service');

mongoconfig.connect();
app.initSever();
cronService.initScheduledJobs();
