const express = require('express');
const router = express.Router();
const { User, Dealership, Deal, Car, SoldVehicle } = require('./model');
const { authMiddleware } = require('./auth');

// Middleware to restrict access to only dealership users
const dealershipAuthMiddleware = (req, res, next) => {
  if (req.user && req.user.user_type === 'dealership') {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Only dealership users allowed.' });
  }
};

// View all cars.
const viewAllCars = async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
};

// View all cars sold by dealership
const viewSoldCars = async (req, res) => {
  try {
    const dealership = await Dealership.findOne({ dealership_email: req.user.email });
    const soldCars = await SoldVehicle.find({ _id: { $in: dealership.sold_vehicles } });
    res.status(200).json(soldCars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sold cars' });
  }
};

// Add cars to dealership
const addCarToDealership = async (req, res) => {
  try {
    const { car_id } = req.body;
    const car = await Car.findById(car_id);
    if (!car) {
      return res.status(404).json({ error: 'Car not found' });
    }

    const dealership = await Dealership.findOne({ dealership_email: req.user.email });
    dealership.cars.push(car);
    await dealership.save();

    res.status(201).json({ message: 'Car added to dealership successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add car to dealership' });
  }
};

// View deals provided by dealership
const viewDeals = async (req, res) => {
  try {
    const dealership = await Dealership.findOne({ dealership_email: req.user.email });
    const deals = await Deal.find({ _id: { $in: dealership.deals } });
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals provided by dealership' });
  }
};

// Add deals to dealership
const addDealToDealership = async (req, res) => {
  try {
    const { deal_id } = req.body;
    const deal = await Deal.findById(deal_id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }

    const dealership = await Dealership.findOne({ dealership_email: req.user.email });
    dealership.deals.push(deal);
    await dealership.save();

    res.status(201).json({ message: 'Deal added to dealership successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add deal to dealership' });
  }
};

// View all vehicles dealership has sold
const viewSoldVehicles = async (req, res) => {
  try {
    const dealership = await Dealership.findOne({ dealership_email: req.user.email });
    const soldVehicles = await SoldVehicle.find({ _id: { $in: dealership.sold_vehicles } });
    res.status(200).json(soldVehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sold vehicles' });
  }
};

// Add new vehicle to the list of sold vehicles after a deal is made
const addVehicleToSoldVehicles = async (req, res) => {
  try {
    const { vehicle_id, car_id, vehicle_info } = req.body;
    const vehicle = await Car.findById(vehicle_id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    const dealership = await Dealership.findOne({ dealership_email: req.user.email });
    const newSoldVehicle = new SoldVehicle({ vehicle_id, car_id, vehicle_info });
    await newSoldVehicle.save();
    dealership.sold_vehicles.push(newSoldVehicle);
    await dealership.save();

    res.status(201).json({ message: 'Vehicle added to the list of sold vehicles' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add vehicle to sold vehicles' });
  }
};

// Routes
router.get('/dealership/cars', authMiddleware, dealershipAuthMiddleware, viewAllCars);
router.get('/dealership/sold-cars', authMiddleware, dealershipAuthMiddleware, viewSoldCars);
router.post('/dealership/cars', authMiddleware, dealershipAuthMiddleware, addCarToDealership);
router.get('/dealership/deals', authMiddleware, dealershipAuthMiddleware, viewDeals);
router.post('/dealership/deals', authMiddleware, dealershipAuthMiddleware, addDealToDealership);
router.get('/dealership/sold-vehicles', authMiddleware, dealershipAuthMiddleware, viewSoldVehicles);
router.post('/dealership/sold-vehicles', authMiddleware, dealershipAuthMiddleware, addVehicleToSoldVehicles);

module.exports = router;
