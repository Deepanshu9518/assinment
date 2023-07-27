const mongoose = require('mongoose');

const { Schema } = mongoose;

// Connect to MongoDB
mongoose.connect('mongodb+srv://deepanshusoni183:Deepanshu%40123@cluster0.oqyl6yr.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Admin Schema
const adminSchema = new Schema({
  admin_id: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model('Admin', adminSchema);

// User Schema
const userSchema = new Schema({
  user_email: { type: String, required: true, unique: true },
  user_id: { type: String },
  user_location: { type: String },
  user_info: { type: Schema.Types.Mixed },
  password: { type: String, required: true },
  vehicle_info: [{ type: Schema.Types.ObjectId, ref: 'SoldVehicle' }],
});

const User = mongoose.model('User', userSchema);

// Dealership Schema
const dealershipSchema = new Schema({
  dealership_email: { type: String, required: true, unique: true },
  dealership_id: { type: String },
  dealership_name: { type: String },
  dealership_location: { type: String },
  password: { type: String, required: true },
  dealership_info: { type: Schema.Types.Mixed },
  cars: [{ type: Schema.Types.ObjectId, ref: 'Car' }],
  deals: [{ type: Schema.Types.ObjectId, ref: 'Deal' }],
  sold_vehicles: [{ type: Schema.Types.ObjectId, ref: 'SoldVehicle' }],
});

const Dealership = mongoose.model('Dealership', dealershipSchema);

// Deal Schema
const dealSchema = new Schema({
  deal_id: { type: String, required: true, unique: true },
  car_id: { type: String },
  deal_info: { type: Schema.Types.Mixed },
});

const Deal = mongoose.model('Deal', dealSchema);

// Car Schema
const carSchema = new Schema({
  car_id: { type: String, required: true, unique: true },
  type: { type: String },
  name: { type: String },
  model: { type: String },
  car_info: { type: Schema.Types.Mixed },
});

const Car = mongoose.model('Car', carSchema);

// SoldVehicle Schema
const soldVehicleSchema = new Schema({
  vehicle_id: { type: String, required: true, unique: true },
  car_id: { type: String },
  vehicle_info: { type: Schema.Types.Mixed },
});

const SoldVehicle = mongoose.model('SoldVehicle', soldVehicleSchema);

module.exports = { Admin, User, Dealership, Deal, Car, SoldVehicle };
