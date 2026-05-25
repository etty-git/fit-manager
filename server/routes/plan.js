const express = require("express");
const router = express.Router();

const {
  getPlans,
  subscribe,
  getMyMembership,
  createPlan,
  updatePlan,
  deletePlan
} = require("../controlers/PlanController");
const isAdmin = require("../middlewares/isAdmin");

const auth = require("../middlewares/auth");
router.get("/", getPlans);
router.get("/me", auth, getMyMembership);
router.post("/subscribe", auth, subscribe);
router.post("/", auth,isAdmin , createPlan);
router.put("/:id", auth, isAdmin, updatePlan);
router.delete("/:id", auth, isAdmin, deletePlan);
module.exports = router;
