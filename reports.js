const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json([
    { title: "Lost Watch", location: "Library" },
    { title: "Found Bag", location: "Main Hall" }
  ]);
});

router.post('/', (req, res) => {
  res.json({ msg: "Report saved" });
});

module.exports = router;