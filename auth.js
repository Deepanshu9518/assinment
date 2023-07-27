const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { Admin, User, Dealership, Deal, Car, SoldVehicle } = require('./model');
const crypto = require('crypto');

const router = express.Router();

const generateSecretKey = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, secretKey, {
    expiresIn: '1h',
  });
};

const registerAdmin = async (req, res) => {
  try {
    const { admin_id, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new Admin({ admin_id, password: hashedPassword });
    await newAdmin.save();
    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register admin' });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { admin_id, password } = req.body;
    const admin = await Admin.findOne({ admin_id });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(admin);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

const registerUser = async (req, res) => {
  try {
    const { user_email, user_location, user_info, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user_id = crypto.randomBytes(8).toString('hex');
    const newUser = new User({
      user_email,
      user_id,
      user_location,
      user_info,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register user' });
  }
};

const loginUser = async (req, res) => {
  try {
    const { user_email, password } = req.body;
    const user = await User.findOne({ user_email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

const registerDealership = async (req, res) => {
  try {
    const {
      dealership_email,
      dealership_name,
      dealership_location,
      dealership_info,
      password,
    } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const dealership_id = crypto.randomBytes(8).toString('hex');
    const newDealership = new Dealership({
      dealership_email,
      dealership_id,
      dealership_name,
      dealership_location,
      dealership_info,
      password: hashedPassword,
    });
    await newDealership.save();
    res.status(201).json({ message: 'Dealership registered successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to register dealership' });
  }
};

const loginDealership = async (req, res) => {
  try {
    const { dealership_email, password } = req.body;
    const dealership = await Dealership.findOne({ dealership_email });
    if (!dealership) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const isPasswordValid = await bcrypt.compare(password, dealership.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = generateToken(dealership);
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to login' });
  }
};

const  authMiddleware 
= (req, res, next) => {
  if (req.path === '/admin/register') {
    return next();
  }

  const token = req.header('Authorization');
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Token not provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

const secretKey = generateSecretKey();
console.log({"secretkey":secretKey})

module.exports = { router, authMiddleware, secretKey };
