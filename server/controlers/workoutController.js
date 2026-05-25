const { generateWorkout } = require('../services/workoutService.js');

const getWorkout = async (req, res) => {
  try {
    const { userProfile } = req.body;
    if (!userProfile) return res.status(400).json({ error: "Missing user profile" });
    
    const workout = await generateWorkout(userProfile);
    res.json(workout);
  } catch (error) {
    console.error("DEBUG ERROR:", error); 
        
        // נשלח חזרה את הודעת השגיאה האמיתית כדי להבין את הבעיה
      res.status(500).json({ error: "Failed to generate", details: error.message });
   
  }
};

module.exports = { getWorkout };