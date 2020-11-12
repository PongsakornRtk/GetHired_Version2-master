const fs = require('fs');
const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const User = require('../models/user');
const Job = require('../models/job');

const getUserFromToken = async (req) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    if (!token) {
      return false;
    }
    const decodedToken = jwt.verify(token, 'supersecret_dont_share');
    req.userData = { userId: decodedToken.userId };
    return req.userData;
  } catch (err) {
    return false;
  }
}

const getUsers = async (req, res, next) => {
  let users;
  try {
    users = await User.find({}, '-password');
  } catch (err) {
    const error = new HttpError(
      'Fetching users failed, please try again later.',
      500
    );
    return next(error);
  }
  res.json({ users: users.map(user => user.toObject({ getters: true })) });
};

const signup = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  console.log(req.body);

  const { name, email, password, companyAddress, telNo, employer } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  if (existingUser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422
    );
    return next(error);
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    image: req.file.path,
    password: hashedPassword,
    employer,
    telNo,
    companyAddress,
    jobs: []
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Signing up failed, please try again later.',
      500
    );
    return next(error);
  }

  res
    .status(201)
    .json({ userId: createdUser.id, email: createdUser.email, token: token });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Could not log you in, please check your credentials and try again.',
      500
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      403
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      'supersecret_dont_share',
      { expiresIn: '1h' }
    );
  } catch (err) {
    const error = new HttpError(
      'Logging in failed, please try again later.',
      500
    );
    return next(error);
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    employer: existingUser.employer,
    token: token
  });
};

const applyJob = async (req, res, next) => {
  const userId = (await getUserFromToken(req)).userId;
  console.log(userId);
  if (!userId) {
    return next(
      new HttpError('Unauthorized.', 401)
    );
  }
  if (!req.params.jobId) {
    return next(
      new HttpError('Invalidata.', 404)
    );
  }
  const jobId = req.params.jobId;
  console.log(userId, 'sda');
  try {
    console.log(userId, 'sdadasd');
    job = await Job.findById(jobId);
    console.log('dsadas')
    user = await User.findById(userId);
    const sess = await mongoose.startSession();
    sess.startTransaction();
    
    console.log('asdsad');
    console.log('usser', user)
    
    job.applier.push(user);
    
    console.log('console')
    console.log('asdsaddaqawedqeq');
    user.jobs.push(job);
    
    console.log('asdsaddaqawedqeq23132131');
    
    console.log('sadasd2');
    
    await job.save({ session: sess });
    await user.save({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.log(err);
    const error = new HttpError(
      'Something went wrong, could not find job.',
      500
    );
    return next(error);
  }

  res.status(200).json({ status: 'done' });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.applyJob = applyJob;
