'use strict';

const UserController = require('./users.controller');
const express = require('express');
const router = express.Router();
// Tokens
const { verifyToken } = require('../../middleware/loggedIn');
// AJV
const { validateBody } = require('../../middleware/AjvValidator/index');
const schemaRegisterUser = require('../../middleware/AjvValidator/User/registerUser');
const schemaLoginUser = require('../../middleware/AjvValidator/User/loginUser');



//Rutas 
router.post('/register', validateBody(schemaRegisterUser), UserController.createUser);
router.post('/login', validateBody(schemaLoginUser), UserController.login);
router.get('/profile', verifyToken, UserController.getById);
router.put('/fcm-token', verifyToken, UserController.saveFcmToken);



//
module.exports = router;
