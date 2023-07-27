const express = require('express');
const { User, Dealership, Deal, Car, SoldVehicle } = require('./model');
const router = express.Router();

// To view all cars
router.get('/user/cars', async (req, res) => {
  try {
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars' });
  }
});

// To view all cars in a dealership
router.get('/user/dealership/cars/:dealership_id', async (req, res) => {
  try {
    const { dealership_id } = req.params;
    const dealership = await Dealership.findById(dealership_id).populate('cars');
    if (!dealership) {
      return res.status(404).json({ error: 'Dealership not found' });
    }
    res.status(200).json(dealership.cars);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cars in dealership' });
  }
});

// To view dealerships with a certain car
router.get('/user/dealerships/:car_id', async (req, res) => {
  try {
    const { car_id } = req.params;
    const dealerships = await Dealership.find({ cars: car_id });
    res.status(200).json(dealerships);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dealerships' });
  }
});

// To view all vehicles owned by user
router.get('/user/vehicles', async (req, res) => {
  try {
    const user = req.user; // User object from the JWT token
    const vehicles = await SoldVehicle.find({ user_id: user.id });
    res.status(200).json(vehicles);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user vehicles' });
  }
});

// To view the dealerships within a certain range based on user location (use maps api)
// For this endpoint, you will need to integrate the maps API to fetch the dealerships within the desired range based on user location.

// To view all deals on a certain car
router.get('/user/deals/:car_id', async (req, res) => {
  try {
    const { car_id } = req.params;
    const deals = await Deal.find({ car_id });
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals' });
  }
});

// To view all deals from a certain dealership
router.get('/user/deals/dealership/:dealership_id', async (req, res) => {
  try {
    const { dealership_id } = req.params;
    const deals = await Deal.find({ dealership_id });
    res.status(200).json(deals);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch deals from dealership' });
  }
});

// To allow user to buy a car after a deal is made
router.post('/user/buy/:deal_id', async (req, res) => {
  try {
    const { deal_id } = req.params;
    const deal = await Deal.findById(deal_id);
    if (!deal) {
      return res.status(404).json({ error: 'Deal not found' });
    }
    
    // Implement the logic to handle the car purchase and update the sold vehicles collection, etc.
    // ...

    res.status(200).json({ message: 'Car purchase successful' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to process car purchase' });
  }
});

module.exports = router;

