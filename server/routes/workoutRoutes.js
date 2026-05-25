const express = require('express');
const router = express.Router();
const { getWorkout } = require("../controlers/workoutController")

router.post('/generate', getWorkout);

module.exports = router;