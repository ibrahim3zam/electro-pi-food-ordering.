const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

const MONGO_LOCAL = 'mongodb://127.0.0.1:27017/food_ordering';

mongoose.connect(process.env.MONGO_URI || MONGO_LOCAL)
  .then(() => console.log(' MongoDB Connected Successfully'))
  .catch(err => {
    console.log('⚠️ MongoDB Connection Error:', err.message);
    console.log('💡 Tip: Server is still running on port 5000 for routing tests!');
  });

// ---  (Schemas & Models) ---
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' } // user أو admin
});
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  name_en: String, name_ar: String,
  desc_en: String, desc_ar: String,
  price: Number, image: String, category: String
});
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: Array,
  total: Number,
  paymentMethod: String, // COD أو Online
  status: { type: String, default: 'Pending' }, // Pending, Preparing, Out for Delivery, Delivered
  createdAt: { type: Date, default: Date.now }
});
const Order = mongoose.model('Order', OrderSchema);

// --------------------- (Routes) ---------------------------

// 1. (Authentication)

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });
    await user.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) { 
    res.status(400).json({ error: err.message }); 
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    res.json({ token: 'mock-jwt-token-' + user._id, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. (Products)
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. (Orders)
app.post('/api/orders', async (req, res) => {
  try {
    const { userId, items, total, paymentMethod } = req.body;
    const order = new Order({ user: userId, items, total, paymentMethod });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/orders/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ user: req.params.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
    res.json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));