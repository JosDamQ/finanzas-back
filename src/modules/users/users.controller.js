'use strict';

const userService = require('./users.service')

exports.createUser = async (req, res, next) => {
    try {
        const data = req.body;
        const newUser = await userService.registerUser(data);
        return res.status(newUser.status).send(newUser);

    } catch (err) {
        console.log(err);
        next(err);
    }
}

exports.login = async (req, res, next) => {
    try {
        const data = req.body;
        const loginUser = await userService.login(data);
        return res.status(loginUser.status).send(loginUser);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

exports.getById = async (req, res, next) => {
    try {
        const id = req.user.id;
        const user = await userService.getById(id);
        return res.status(user.status).send(user);
    } catch (err) {
        console.log(err);
        next(err);
    }
}

exports.saveFcmToken = async (req, res, next) => {
    try {
        const id = req.user.id;
        const { fcmToken } = req.body;
        if (!fcmToken) return res.status(400).send({ message: 'fcmToken is required' });
        
        const user = await userService.saveFcmToken(id, fcmToken);
        return res.status(user.status).send(user);
    } catch (err) {
        console.log(err);
        next(err);
    }
}
