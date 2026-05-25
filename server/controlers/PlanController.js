const Plan = require("../models/Plans");
const {
  getAllPlans,
  updatePlan: updatePlanService,
  deletePlan: deletePlanService,
  subscribeToPlan
} = require("../services/planService");

const User = require("../models/User");
const createPlan = async (req, res) => {
  try {
    const plan = await Plan.create(req.body);

    res.status(201).json({
      message: "Plan created",
      plan
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
/* ================= Get Plans ================= */
const getPlans = async (req, res) => {
  try {
    const plans = await getAllPlans();
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// רכישת מנוי
// ================= Subscribe =================
const subscribe = async (req, res) => {
  try {
    const result = await subscribeToPlan(
      req.user.id,
      req.body.planId
    );

    res.status(200).json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
/* ================= My Membership ================= */
const getMyMembership = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate("planId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      plan: user.planId, // 🔥 במקום membershipType
      status: user.membershipStatus,
      start: user.membershipStart,
      end: user.membershipEnd
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
const updatePlan = async (req, res) => {
  try {
    const plan = await updatePlanService(req.params.id, req.body);

    res.json({
      message: "Plan updated",
      plan
    });
  } catch (err) {
    res.status(400).json({ error: err.message, message: err.message });
  }
};

const deletePlan = async (req, res) => {
  try {
    const plan = await deletePlanService(req.params.id);

    res.json({
      message: "Plan deleted",
      plan
    });
  } catch (err) {
    res.status(400).json({ error: err.message, message: err.message });
  }
};

module.exports = {
  getPlans,
  subscribe,
  getMyMembership,
  createPlan,
  updatePlan,
  deletePlan
};
