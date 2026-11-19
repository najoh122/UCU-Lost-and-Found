// Second Person  - Backend for UCU Lost and Found
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

let lostItems = [];
let foundItems = [];
let claims = [];
let id = 1;

// HOME - check if backend is working
app.get('/', (req, res) => {
  res.send('UCU Lost and Found Backend is Running!');
});

// GET ALL LOST ITEMS
app.get('/api/lost', (req, res) => {
  res.json(lostItems);
});

// REPORT LOST ITEM
app.post('/api/lost', (req, res) => {
  const item = { id: id++, ...req.body, status: 'lost', date: new Date() };
  lostItems.push(item);
  res.json(item);
});

// GET ALL FOUND ITEMS
app.get('/api/found', (req, res) => {
  res.json(foundItems);
});

// REPORT FOUND ITEM
app.post('/api/found', (req, res) => {
  const item = { id: id++, ...req.body, status: 'found', date: new Date() };
  foundItems.push(item);
  res.json(item);
});

// MAKE A CLAIM
app.post('/api/claims', (req, res) => {
  const claim = { id: id++, ...req.body, approved: false };
  claims.push(claim);
  res.json(claim);
});

// GET ALL CLAIMS - for Admin
app.get('/api/claims', (req, res) => {
  res.json(claims);
});

// APPROVE ALL CLAIMS - Admin button
app.post('/api/claims/approve-all', (req, res) => {
  claims = claims.map(c => ({ ...c, approved: true }));
  res.json({ message: 'All claims approved', claims });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});