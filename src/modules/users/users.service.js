'use strict';

const UserModel = require('./users.model');
const { generateToken } = require('../../services/jwt');
const { encrypt, comparePassword } = require('../../utils/validate')

exports.registerUser = async (data) => {
    try {
        const { name, birthdate, phone, email, password } = data;
        // validate email already exists
        const user = await UserModel.findOne({ email });
        if (user) return {
            success: false,
            message: 'Email already exists',
            status: 409,
            data: null
        };


        //validate phone already exists
        const phoneUser = await UserModel.findOne({ phone });
        if (phoneUser) return {
            success: false,
            message: 'Phone already exists',
            status: 409,
            data: null
        };

        // encrypt password
        const encryptedPassword = await encrypt(password);

        // create user
        const newUser = new UserModel({
            name,
            birthdate,
            phone,
            email,
            password: encryptedPassword
        });

        // save user
        await newUser.save();

        // return user
        return {
            success: true,
            message: 'User registered successfully',
            status: 201,
            data: newUser
        };
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.login = async (data) => {
    try{
        const { email, password } = data;
        // validate email already exists
        const user = await UserModel.findOne({ email });
        if (!user) return {
            success: false,
            message: 'Email not found',
            status: 404,
            data: null
        };

        // validate password
        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) return {
            success: false,
            message: 'Invalid password',
            status: 401,
            data: null
        };

        // generate token
        const token = await generateToken(user);
        console.log(token);

        // return user
        return {
            success: true,
            message: 'User logged in successfully',
            status: 200,
            data: {
                user,
                token
            }
        };
    } catch (error) {
        console.log(error);
        return error;
    }
}

exports.getById = async (id) => {
    try {
        const user = await UserModel.findById(id);
        if (!user) return {
            success: false,
            message: 'User not found',
            status: 404,
            data: null
        };
        return {
            success: true,
            message: 'User found',
            status: 200,
            data: user
        };
    } catch (error) {
        console.log(error);
        return error;
    }
}

